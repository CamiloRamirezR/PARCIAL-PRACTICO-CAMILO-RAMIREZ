import { Module } from '@nestjs/common';
import { AirlineService } from './airline.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineEntity } from './airline.entity';

@Module({
  providers: [AirlineService],
  imports: [TypeOrmModule.forFeature([AirlineEntity])],
})
export class AirlineModule {}
