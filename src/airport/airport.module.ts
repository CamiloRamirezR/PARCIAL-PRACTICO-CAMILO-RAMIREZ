import { Module } from '@nestjs/common';
import { AirportService } from './airport.service';

@Module({
  providers: [AirportService]
})
export class AirportModule {}
