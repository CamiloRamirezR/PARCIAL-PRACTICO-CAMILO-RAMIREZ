import { Module } from '@nestjs/common';
import { AirlineService } from './airline.service';

@Module({
  providers: [AirlineService]
})
export class AirlineModule {}
