import { Test, TestingModule } from '@nestjs/testing';
import { AirlineAirportService } from './airline-airport.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { faker } from '@faker-js/faker';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AirlineAirportService', () => {
  let service: AirlineAirportService;
  let airlineRepository: Repository<AirlineEntity>;
  let airportRepository: Repository<AirportEntity>;
  let airlinesList: AirlineEntity[];
  let airline: AirlineEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineAirportService],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
    airlineRepository = module.get<Repository<AirlineEntity>>(
      getRepositoryToken(AirlineEntity),
    );
    airportRepository = module.get<Repository<AirportEntity>>(
      getRepositoryToken(AirportEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    // Limpiar las tablas para evitar datos persistentes
    await airlineRepository.clear();
    await airportRepository.clear();
  
    // Crear una lista de aeropuertos
    const airportsList: AirportEntity[] = [];
    for (let i = 0; i < 5; i++) {
      const airport: AirportEntity = await airportRepository.save({
        name: faker.company.name(),
        code: faker.number.int({ min: 100, max: 999 }).toString(),
        city: faker.location.city(),
        country: faker.location.country(),
        airlines: [],
      });
      airportsList.push(airport);
    }
  
    // Crear una aerolínea y asociar aeropuertos
    airline = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      website: faker.internet.url(),
      foundationDate: faker.date.past(),
      airports: airportsList,
    });
  
    airlinesList = await airlineRepository.find({
      relations: ['airports'],
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAirportToAirline should add an airport to an airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.number.int({ min: 100, max: 999 }).toString(),
      city: faker.location.city(),
      country: faker.location.country(),
      airlines: [],
    });
  
    const updatedAirline = await service.addAirportToAirline(airline.id, newAirport.id);
    expect(updatedAirline.airports.length).toBe(6);
    expect(updatedAirline.airports.find(a => a.id === newAirport.id)).toBeDefined();
  });

  it('addAirportToAirline should throw an exception for an invalid airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.number.int({ min: 100, max: 999 }).toString(),
      city: faker.location.city(),
      country: faker.location.country(),
      airlines: [],
    });
  
    await expect(service.addAirportToAirline('0', newAirport.id)).rejects.toMatchObject(
      new BusinessLogicException('The airline with the given ID was not found.', BusinessError.NOT_FOUND),
    );
  });

  it('addAirportToAirline should throw an exception for an invalid airport', async () => {
    await expect(service.addAirportToAirline(airline.id, '0')).rejects.toMatchObject(
      new BusinessLogicException('The airport with the given ID was not found.', BusinessError.NOT_FOUND),
    );
  });

  it('findAirportsFromAirline should return airports from an airline', async () => {
    const airports = await service.findAirportsFromAirline(airline.id);
    expect(airports.length).toBe(5);
  });

  it('findAirportsFromAirline should throw an exception for an invalid airline', async () => {
    await expect(service.findAirportsFromAirline('0')).rejects.toMatchObject(
      new BusinessLogicException('The airline with the given ID was not found.', BusinessError.NOT_FOUND),
    );
  });

  it('findAirportFromAirline should return an airport associated with an airline', async () => {
    const airport = airlinesList[0].airports[0];
    const result = await service.findAirportFromAirline(airline.id, airport.id);
    expect(result).toBeDefined();
    expect(result.id).toBe(airport.id);
  });

  it('findAirportFromAirline should throw an exception for an invalid airline', async () => {
    const airport = airlinesList[0].airports[0];
    await expect(service.findAirportFromAirline('0', airport.id)).rejects.toMatchObject(
      new BusinessLogicException('The airline with the given ID was not found.', BusinessError.NOT_FOUND),
    );
  });

  it('findAirportFromAirline should throw an exception for an airport not related to the airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.number.int({ min: 100, max: 999 }).toString(),
      city: faker.location.city(),
      country: faker.location.country(),
      airlines: [],
    });
  
    await expect(service.findAirportFromAirline(airline.id, newAirport.id)).rejects.toMatchObject(
      new BusinessLogicException('Airport not related to the airline', BusinessError.PRECONDITION_FAILED),
    );
  });

  it('updateAirportsFromAirline should update the list of airports for an airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.number.int({ min: 100, max: 999 }).toString(),
      city: faker.location.city(),
      country: faker.location.country(),
      airlines: [],
    });
  
    const updatedAirline = await service.updateAirportsFromAirline(airline.id, [newAirport]);
    expect(updatedAirline.airports.length).toBe(1);
    expect(updatedAirline.airports[0].id).toBe(newAirport.id);
  });

  it('updateAirportsFromAirline should throw an exception for an invalid airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.number.int({ min: 100, max: 999 }).toString(),
      city: faker.location.city(),
      country: faker.location.country(),
      airlines: [],
    });
  
    await expect(service.updateAirportsFromAirline('0', [newAirport])).rejects.toMatchObject(
      new BusinessLogicException('The airline with the given ID was not found.', BusinessError.NOT_FOUND),
    );
  });

  it('updateAirportsFromAirline should throw an exception for an invalid airport', async () => {
    await expect(service.updateAirportsFromAirline(airline.id, [{ id: '0' } as AirportEntity])).rejects.toMatchObject(
      new BusinessLogicException('The airport with the given ID was not found.', BusinessError.NOT_FOUND),
    );
  });

  it('deleteAirportFromAirline should remove an airport from an airline', async () => {
    const airport = airlinesList[0].airports[0];
  
    await service.deleteAirportFromAirline(airline.id, airport.id);
  
    const updatedAirline = await airlineRepository.findOne({
      where: { id: airline.id },
      relations: ['airports'],
    });
  
    expect(updatedAirline.airports.find(a => a.id === airport.id)).toBeUndefined();
  });

  it('deleteAirportFromAirline should throw an exception for an invalid airline', async () => {
    const airport = airlinesList[0].airports[0];
  
    await expect(service.deleteAirportFromAirline('0', airport.id)).rejects.toMatchObject(
      new BusinessLogicException('The airline with the given ID was not found.', BusinessError.NOT_FOUND),
    );
  });

  it('deleteAirportFromAirline should throw an exception for an airport not related to the airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.number.int({ min: 100, max: 999 }).toString(),
      city: faker.location.city(),
      country: faker.location.country(),
      airlines: [],
    });
  
    await expect(service.deleteAirportFromAirline(airline.id, newAirport.id)).rejects.toMatchObject(
      new BusinessLogicException('Airport not related to the airline', BusinessError.PRECONDITION_FAILED),
    );
  });
});
