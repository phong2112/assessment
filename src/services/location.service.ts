import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, TreeRepository } from 'typeorm';
import { Location } from '@entities/location.entity';
import { CreateLocationDto, UpdateLocationDto } from '@models/location.model';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: TreeRepository<Location>,
  ) {}

  async create(locationDto: CreateLocationDto): Promise<Location> {
    try {
      const { name, area, buildingName, shortName } = locationDto;
      const location = this.locationRepository.create({
        name,
        area,
        buildingName,
        shortName,
      });

      // Update parent node child and location number sync
      if (locationDto?.parentId) {
        location.parent = await this.locationRepository.findOne({
          where: {
            id: locationDto?.parentId,
          },
          relations: ['parent'],
        });
        location.buildingName = location.parent.buildingName;
      }

      location.locationNumber = `${location.parent ? location.parent.locationNumber : location.buildingName}-${location.shortName}`;

      return await this.locationRepository.save(location);
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async getAll(): Promise<Location[]> {
    return this.locationRepository.find(); // Retrieves all locations
  }

  async getById(id: number): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { id },
    });
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return location;
  }

  async update(
    id: number,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { id },
      relations: ['parent'],
    });
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    const currentLocationNumber = location.locationNumber;
    Object.assign(location, updateLocationDto);

    // Update parent node child and location number sync
    const parentId = updateLocationDto?.parentId || location?.parent?.id;
    if (parentId) {
      location.parent = await this.locationRepository.findOne({
        where: {
          id: parentId,
        },
        relations: ['parent'],
      });
      location.buildingName = location.parent.buildingName;
    }
    location.locationNumber = `${location.parent ? location.parent.locationNumber : location.buildingName}-${location.shortName}`;

    // Update all the descendants node childs
    const descendants = await this.locationRepository.find({
      where: { locationNumber: Like(`${currentLocationNumber}%`) }, // Materialized-path style lookup
    });

    for (const child of descendants) {
      child.locationNumber = child.locationNumber.replace(
        new RegExp(`^${currentLocationNumber}`), // Old prefix
        location.parent
          ? `${location.parent.locationNumber}-${location.shortName}`
          : `${location.buildingName}-${location.shortName}`, // New prefix
      );
      await this.locationRepository.save(child); // Save the updated child
    }

    return await this.locationRepository.save(location);
  }

  async delete(id: number): Promise<void> {
    const location = await this.locationRepository.findOne({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    const directChildrenCount = await this.locationRepository.count({
      where: {
        locationNumber: Like(`${location.locationNumber}-%`), // Matches direct children
      },
    });

    if (directChildrenCount > 0) {
      throw new ConflictException(
        `Location with ID ${id} has direct children and cannot be deleted`,
      );
    }

    await this.locationRepository.remove(location);
  }

  // Get all child locations under a specific location
  async findChildren(locationNumber: string): Promise<Location[]> {
    return await this.locationRepository.find({
      where: { locationNumber: Like(`${locationNumber}%`) },
    });
  }

  // async getTree(): Promise<Location[]> {
  //   return this.locationRepository.findTrees(); // Retrieves location as a tree
  // }
}
