import { Module } from '@nestjs/common';
import { AirlineAirportService } from './airline-airport.service';

@Module({
  providers: [AirlineAirportService]
})
export class AirlineAirportModule {}
