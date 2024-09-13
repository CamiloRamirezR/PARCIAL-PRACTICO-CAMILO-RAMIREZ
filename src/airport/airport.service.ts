import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirportEntity } from './airport.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AirportService {

    constructor(
        @InjectRepository(AirportEntity)
        private airportRepository: Repository<AirportEntity>,
    ) {}
}
