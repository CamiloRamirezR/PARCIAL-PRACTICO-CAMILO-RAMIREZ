import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AirportEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    code: string;

    @Column()
    city: string;

    @Column()
    country: string;
}
