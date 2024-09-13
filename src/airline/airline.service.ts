import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirlineEntity } from './airline.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AirlineService {

    constructor(
        @InjectRepository(AirlineEntity)
        private airlineRepository: Repository<AirlineEntity>,
    ) {}
}
