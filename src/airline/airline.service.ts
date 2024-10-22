import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirlineEntity } from './airline.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { unknownMsg } from '../shared/utils/validation.utils';

@Injectable()
export class AirlineService {
  constructor(
    @InjectRepository(AirlineEntity)
    private airlineRepository: Repository<AirlineEntity>,
  ) {}

  async findAll(): Promise<AirlineEntity[]> {
    return this.airlineRepository.find({
      relations: ['airports'],
    });
  }

  async findOne(id: string): Promise<AirlineEntity> {
    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id },
      relations: ['airports'],
    });

    if (!airline) {
      throw new BusinessLogicException(
        unknownMsg('airline'),
        BusinessError.NOT_FOUND,
      );
    }

    return airline;
  }

  async create(airline: AirlineEntity): Promise<AirlineEntity> {
    const currentDate = new Date();
    const foundationDate = new Date(airline.foundationDate);

    if (foundationDate > currentDate) {
      throw new BusinessLogicException(
        'The foundation date cannot be in the future',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return this.airlineRepository.save(airline);
  }

  async create_2(airline: AirlineEntity): Promise<AirlineEntity> {
    const currentDate = new Date();
    const foundationDate = new Date(airline.foundationDate);

    if (foundationDate > currentDate) {
      throw new BusinessLogicException(
        'The foundation date cannot be in the future',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return this.airlineRepository.save(airline);
  }

  async create_3(airline: AirlineEntity): Promise<AirlineEntity> {
    const currentDate = new Date();
    const foundationDate = new Date(airline.foundationDate);

    if (foundationDate > currentDate) {
      throw new BusinessLogicException(
        'The foundation date cannot be in the future',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return this.airlineRepository.save(airline);
  }

  async update(id: string, airline: AirlineEntity): Promise<AirlineEntity> {
    const existingAirline = await this.airlineRepository.findOne({
      where: { id },
    });
    const currentDate = new Date();
    const foundationDate = new Date(airline.foundationDate);

    if (!existingAirline) {
      throw new BusinessLogicException(
        unknownMsg('airline'),
        BusinessError.NOT_FOUND,
      );
    }

    if (foundationDate > currentDate) {
      throw new BusinessLogicException(
        'The foundation date cannot be in the future',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.airlineRepository.save({
      ...existingAirline,
      ...airline,
    });
  }

  async update_2(id: string, airline: AirlineEntity): Promise<AirlineEntity> {
    const existingAirline = await this.airlineRepository.findOne({
      where: { id },
    });
    const currentDate = new Date();
    const foundationDate = new Date(airline.foundationDate);

    if (!existingAirline) {
      throw new BusinessLogicException(
        unknownMsg('airline'),
        BusinessError.NOT_FOUND,
      );
    }

    if (foundationDate > currentDate) {
      throw new BusinessLogicException(
        'The foundation date cannot be in the future',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.airlineRepository.save({
      ...existingAirline,
      ...airline,
    });
  }

  async delete(id: string) {
    const airline = await this.airlineRepository.findOne({
      where: { id },
      relations: ['airports'],
    });

    if (!airline) {
      throw new BusinessLogicException(
        unknownMsg('airline'),
        BusinessError.NOT_FOUND,
      );
    }

    await this.airlineRepository.remove(airline);
  }
}
