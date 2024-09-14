import { Injectable } from '@nestjs/common';
import { AirlineEntity } from '../airline/airline.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AirportEntity } from '../airport/airport.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { unknownMsg } from '../shared/utils/validation.utils';

@Injectable()
export class AirlineAirportService {
    constructor(
        @InjectRepository(AirlineEntity)
        private readonly airlineRepository: Repository<AirlineEntity>,

        @InjectRepository(AirportEntity)
        private readonly airportRepository: Repository<AirportEntity>,
    ) {}

    async addAirportToAirline( airlineId: string, airportId: string): Promise<AirlineEntity> {
        const airline: AirlineEntity = await this.airlineRepository.findOne({
            where: { id: airlineId },
            relations: ['airports'],
        });
        
        if (!airline) {
            throw new BusinessLogicException(
                unknownMsg('airline'),
                BusinessError.NOT_FOUND,
            );
        }

        const airport: AirportEntity = await this.airportRepository.findOne({
            where: { id: airportId },
        });

        if (!airport) {
            throw new BusinessLogicException(
                unknownMsg('airport'),
                BusinessError.NOT_FOUND,
            );
        }

        if (!airline.airports){
            airline.airports = [];
        }
        if (!airport.airlines){
            airport.airlines = [];
        }

        airline.airports = [...airline.airports, airport];
        airport.airlines = [...airport.airlines, airline];

        await this.airlineRepository.save(airline);

        return await this.airlineRepository.findOne({
            where: { id: airlineId },
            relations: ['airports'],
        });
    }

    async findAirportsFromAirline(airlineId: string): Promise<AirportEntity[]> {
        const airline: AirlineEntity = await this.airlineRepository.findOne({
            where: { id: airlineId },
            relations: ['airports'],
        });

        if (!airline) {
            throw new BusinessLogicException(
                unknownMsg('airline'),
                BusinessError.NOT_FOUND,
            );
        }

        return airline.airports;
    }

    async findAirportFromAirline(airlineId: string, airportId: string): Promise<AirportEntity> {
        const airline: AirlineEntity = await this.airlineRepository.findOne({
          where: { id: airlineId },
          relations: ['airports'],
        });
      
        if (!airline) {
          throw new BusinessLogicException(
            unknownMsg('airline'),
            BusinessError.NOT_FOUND,
          );
        }
      
        const airportFromAirline: AirportEntity = airline.airports.find((a) => a.id === airportId);
      
        if (!airportFromAirline) {
          throw new BusinessLogicException(
            'Airport not related to the airline',
            BusinessError.PRECONDITION_FAILED,
          );
        }
      
        return airportFromAirline;
    }

    async updateAirportsFromAirline(
        airlineId: string,
        airports: AirportEntity[],
      ): Promise<AirlineEntity> {
        const airline: AirlineEntity = await this.airlineRepository.findOne({
          where: { id: airlineId },
          relations: ['airports'],
        });
      
        if (!airline) {
          throw new BusinessLogicException(unknownMsg('airline'), BusinessError.NOT_FOUND);
        }
      
        const validatedAirports: AirportEntity[] = [];
        for (const airport of airports) {
          const foundAirport: AirportEntity = await this.airportRepository.findOne({
            where: { id: airport.id },
            relations: ['airlines'],
          });
      
          if (!foundAirport) {
            throw new BusinessLogicException(unknownMsg('airport'), BusinessError.NOT_FOUND);
          }
      
          validatedAirports.push(foundAirport);
        }
      
        airline.airports = validatedAirports;
        await this.airlineRepository.save(airline);
      
        for (const airport of validatedAirports) {
          if (!airport.airlines) {
            airport.airlines = [];
          }
      
          if (!airport.airlines.some((a) => a.id === airline.id)) {
            airport.airlines.push(airline);
          }
      
          await this.airportRepository.save(airport);
        }
      
        const existingAirports = airline.airports;
        for (const airport of existingAirports) {
          if (!validatedAirports.some((a) => a.id === airport.id)) {
            airport.airlines = airport.airlines.filter((a) => a.id !== airline.id);
            await this.airportRepository.save(airport);
          }
        }
      
        return await this.airlineRepository.findOne({
          where: { id: airlineId },
          relations: ['airports'],
        });
    }      

    async deleteAirportFromAirline(airlineId: string, airportId: string): Promise<void> {
        const airline: AirlineEntity = await this.airlineRepository.findOne({
            where: { id: airlineId },
            relations: ['airports'],
        });

        if (!airline) {
            throw new BusinessLogicException(
                unknownMsg('airline'),
                BusinessError.NOT_FOUND,
            );
        }

        const airport: AirportEntity = airline.airports.find((a) => a.id === airportId);

        if (!airport) {
            throw new BusinessLogicException(
                'Airport not related to the airline',
                BusinessError.PRECONDITION_FAILED,
            );
        }

        airline.airports = airline.airports.filter((a) => a.id !== airportId);
        await this.airlineRepository.save(airline);

        airport.airlines = airport.airlines.filter((a) => a.id !== airlineId);
        await this.airportRepository.save(airport);
    }
}
