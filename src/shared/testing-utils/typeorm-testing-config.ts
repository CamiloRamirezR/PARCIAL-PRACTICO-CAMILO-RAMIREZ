import { TypeOrmModule } from "@nestjs/typeorm";
import { AirlineEntity } from "../../airline/airline.entity";
import { AirportEntity } from "../../airport/airport.entity";


export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [
        AirlineEntity,
        AirportEntity,
      ],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    TypeOrmModule.forFeature([
        AirlineEntity,
        AirportEntity,
    ]),
  ];