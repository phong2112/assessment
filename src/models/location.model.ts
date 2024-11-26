import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({ description: 'The name of location' })
  name: string;

  @ApiProperty({ description: 'The area of location' })
  area: number;

  // Building name (e.g., "A", "B", "C")
  @ApiProperty({ description: 'Location building name' })
  buildingName: string;

  // Location short name
  @ApiProperty({ description: 'Location short name' })
  shortName: string;

  @ApiProperty({ description: 'The parent id of location', required: false })
  @Optional()
  parentId?: number;
}

export class UpdateLocationDto {
  @ApiProperty({ description: 'The name of location', required: false })
  @Optional()
  name?: string;

  @ApiProperty({ description: 'The area of location', required: false })
  @Optional()
  area?: number;

  @ApiProperty({ description: 'The parent id of location', required: false })
  @Optional()
  parentId?: number;

  @ApiProperty({ description: 'The building name', required: false })
  @Optional()
  buildingName?: string;

  // @ApiProperty({ description: 'The short name', required: false })
  // @Optional()
  // shortName?: string;
}
