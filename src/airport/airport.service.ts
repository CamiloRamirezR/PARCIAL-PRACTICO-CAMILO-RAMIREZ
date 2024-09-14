import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirportEntity } from './airport.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { unknownMsg } from '../shared/utils/validation.utils';

@Injectable()
export class AirportService {

    constructor(
        @InjectRepository(AirportEntity)
        private airportRepository: Repository<AirportEntity>,
    ) {}

    async findAll(): Promise<AirportEntity[]> {
        return this.airportRepository.find({
            relations: ['airlines'],
        });
    }

    async findOne(id: string): Promise<AirportEntity> {
        const airport: AirportEntity = await this.airportRepository.findOne({
            where: { id },
            relations: ['airlines'],
        });

        if (!airport) {
            throw new BusinessLogicException(
                unknownMsg('airport'),
                BusinessError.NOT_FOUND,
            );
        }
        
        return airport;
    }

    async create(airport: AirportEntity): Promise<AirportEntity> {
        if (airport.code.length !== 3) {
            throw new BusinessLogicException(
                'Airport code must have exactly 3 characters',
                BusinessError.PRECONDITION_FAILED,
            );
        }

        return this.airportRepository.save(airport);
    }

    async update(id: string, airport: AirportEntity): Promise<AirportEntity> {
        const existingAirport = await this.airportRepository.findOne({ where: { id } });

        if (!existingAirport) {
            throw new BusinessLogicException(
                unknownMsg('airport'),
                BusinessError.NOT_FOUND,
            );
        }

        if (airport.code.length !== 3) {
            throw new BusinessLogicException(
                'Airport code must have exactly 3 characters',
                BusinessError.PRECONDITION_FAILED,
            );
        }

        return this.airportRepository.save(airport);
    }

    async delete(id: string) {
        const airport = await this.airportRepository.findOne({
             where: { id },
             relations: ['airlines'],
             });

        if (!airport) {
            throw new BusinessLogicException(
                unknownMsg('airport'),
                BusinessError.NOT_FOUND,
            );
        }

        await this.airportRepository.remove(airport);
    }
}
