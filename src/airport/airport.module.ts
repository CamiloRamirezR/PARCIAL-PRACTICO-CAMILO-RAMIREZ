import { Module } from '@nestjs/common';
import { AirportService } from './airport.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportEntity } from './airport.entity';

@Module({
  providers: [AirportService],
  imports: [TypeOrmModule.forFeature([AirportEntity])],
})
export class AirportModule {}
