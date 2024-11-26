import { Location } from '@entities/location.entity';
import { CreateLocationDto, UpdateLocationDto } from '@models/location.model';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocationService } from '@services/location.service';

@Controller('locations')
@ApiTags('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new location' })
  @ApiBody({ type: CreateLocationDto }) // Automatically document the request body
  @ApiResponse({
    status: 201,
    description: 'The cat has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() body: CreateLocationDto) {
    return this.locationService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all locations as list' })
  getAll() {
    return this.locationService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific location based on id' })
  getById(@Param('id') id: number) {
    return this.locationService.getById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a location by ID' })
  @ApiBody({ type: UpdateLocationDto })
  @ApiResponse({
    status: 200,
    description: 'The location has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Location not found' })
  update(@Param('id') id: number, @Body() body: UpdateLocationDto) {
    return this.locationService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a location by ID' })
  @ApiResponse({
    status: 200,
    description: 'The location has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Location not found' })
  delete(@Param('id') id: number) {
    return this.locationService.delete(id);
  }

  // Get all child locations under a specific locationNumber
  @Get(':locationNumber/children')
  async findChildren(
    @Param('locationNumber') locationNumber: string,
  ): Promise<Location[]> {
    return await this.locationService.findChildren(locationNumber);
  }
}
