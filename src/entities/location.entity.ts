import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Tree,
  TreeParent,
  // BeforeInsert,
  // BeforeUpdate,
} from 'typeorm';

@Entity('locations')
@Tree('materialized-path')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // To storing the materialized path
  @Column({ unique: true })
  locationNumber: string;

  @Column({ type: 'float', nullable: true })
  area: number;

  // Building name (e.g., "A", "B", "C")
  @Column()
  buildingName: string;

  // Location short name
  @Column({ unique: true })
  shortName: string;

  @TreeParent()
  parent?: Location;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // @BeforeInsert()
  // @BeforeUpdate()
  // async generateLocationNumber(): Promise<void> {
  //   const currentParent = this.parent;
  //   let locationPath = currentParent
  //     ? `${currentParent.locationNumber}`
  //     : `${this.buildingName}`;

  //   locationPath = `${locationPath}-${this.shortName}`;
  //   // Set the final locationNumber
  //   this.locationNumber = locationPath;
  // }
}
