import { Module } from '@nestjs/common';
import { AirlineService } from './airline.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineEntity } from './airline.entity';
import { AirlineController } from './airline.controller';

@Module({
  providers: [AirlineService],
  imports: [TypeOrmModule.forFeature([AirlineEntity])],
  controllers: [AirlineController],
})
export class AirlineModule {}
