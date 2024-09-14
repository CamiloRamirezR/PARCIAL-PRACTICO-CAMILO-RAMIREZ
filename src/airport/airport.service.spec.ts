import { Test, TestingModule } from '@nestjs/testing';
import { AirportService } from './airport.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { faker } from '@faker-js/faker';
import { AirportEntity } from './airport.entity';

describe('AirportService', () => {
  let service: AirportService;
  let repository: Repository<AirportEntity>;
  let airportsList: AirportEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirportService],
    }).compile();

    service = module.get<AirportService>(AirportService);
    repository = module.get<Repository<AirportEntity>>(
      getRepositoryToken(AirportEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    airportsList = [];
    for (let i = 0; i < 5; i++) {
      const airport: AirportEntity = await repository.save({
        name: faker.company.name(),
        code: faker.number.int({ min: 100, max: 999 }).toString(),
        city: faker.location.city(),
        country: faker.location.country(),
      });
      airportsList.push(airport);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airports', async () => {
    const airports: AirportEntity[] = await service.findAll();
    expect(airports).not.toBeNull();
    expect(airports.length).toBe(5); // Basado en el seedDatabase
  });

  it('findOne should return an airport by id', async () => {
    const storedAirport: AirportEntity = airportsList[0];
    const airport: AirportEntity = await service.findOne(storedAirport.id);
    expect(airport).not.toBeNull();
    expect(airport.name).toEqual(storedAirport.name);
    expect(airport.code).toEqual(storedAirport.code);
  });

  it('findOne should throw an exception for an invalid airport', async () => {
    await expect(service.findOne('0')).rejects.toMatchObject(
      new BusinessLogicException(
        'The airport with the given ID was not found.',
        BusinessError.NOT_FOUND,
      ),
    );
  });

  it('create should successfully create a new airport', async () => {
    const airport: AirportEntity = {
      id: '',
      name: faker.company.name(),
      code: 'ABC', // Código válido
      city: faker.location.city(),
      country: faker.location.country(),
      airlines: [],
    };
  
    const newAirport: AirportEntity = await service.create(airport);
    expect(newAirport).not.toBeNull();
  
    const storedAirport: AirportEntity = await repository.findOne({
      where: { id: newAirport.id },
    });
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toEqual(airport.name);
    expect(storedAirport.code).toEqual(airport.code);
  });

  it('create should throw an exception when the airport code is not 3 characters', async () => {
    const airport: AirportEntity = {
      id: '',
      name: faker.company.name(),
      code: 'AB', // Código inválido
      city: faker.location.city(),
      country: faker.location.country(),
      airlines: [],
    };
  
    await expect(() => service.create(airport)).rejects.toMatchObject(
      new BusinessLogicException(
        'Airport code must have exactly 3 characters',
        BusinessError.PRECONDITION_FAILED,
      ),
    );
  });

  it('update should modify an existing airport', async () => {
    const airport: AirportEntity = airportsList[0];
    airport.name = 'Updated Name';
    airport.code = 'XYZ'; // Código válido
  
    const updatedAirport: AirportEntity = await service.update(airport.id, airport);
    expect(updatedAirport).not.toBeNull();
  
    const storedAirport: AirportEntity = await repository.findOne({
      where: { id: airport.id },
    });
    expect(storedAirport.name).toEqual('Updated Name');
    expect(storedAirport.code).toEqual('XYZ');
  });

  it('update should throw an exception for an invalid airport', async () => {
    const airport: AirportEntity = {
      id: '0',
      name: faker.company.name(),
      code: 'XYZ',
      city: faker.location.city(),
      country: faker.location.country(),
      airlines: [],
    };
  
    await expect(() => service.update('0', airport)).rejects.toMatchObject(
      new BusinessLogicException(
        'The airport with the given ID was not found.',
        BusinessError.NOT_FOUND,
      ),
    );
  });

  it('update should throw an exception when the airport code is not 3 characters', async () => {
    const airport: AirportEntity = airportsList[0];
    airport.code = 'AB'; // Código inválido
  
    await expect(() => service.update(airport.id, airport)).rejects.toMatchObject(
      new BusinessLogicException(
        'Airport code must have exactly 3 characters',
        BusinessError.PRECONDITION_FAILED,
      ),
    );
  });

  it('delete should remove an airport', async () => {
    const airport: AirportEntity = airportsList[0];
    await service.delete(airport.id);
  
    const deletedAirport: AirportEntity = await repository.findOne({
      where: { id: airport.id },
    });
    expect(deletedAirport).toBeNull();
  });

  it('delete should throw an exception for an invalid airport', async () => {
    await expect(() => service.delete('0')).rejects.toMatchObject(
      new BusinessLogicException(
        'The airport with the given ID was not found.',
        BusinessError.NOT_FOUND,
      ),
    );
  });
});
