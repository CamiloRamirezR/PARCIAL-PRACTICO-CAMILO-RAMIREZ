import { Module } from '@nestjs/common';
import { AirlineAirportService } from './airline-airport.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';

@Module({
  providers: [AirlineAirportService],
  imports: [
    TypeOrmModule.forFeature([AirlineEntity, AirportEntity]),
  ],
})
export class AirlineAirportModule {}
