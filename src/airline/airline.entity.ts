import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AirlineEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    website: string;

    @Column()
    foundationDate: Date;
}
