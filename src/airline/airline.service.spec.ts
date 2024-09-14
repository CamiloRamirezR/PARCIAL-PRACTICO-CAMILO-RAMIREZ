import { Test, TestingModule } from '@nestjs/testing';
import { AirlineService } from './airline.service';
import { Repository } from 'typeorm';
import { AirlineEntity } from './airline.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { faker } from '@faker-js/faker';

describe('AirlineService', () => {
  let service: AirlineService;
  let repository: Repository<AirlineEntity>;
  let airlinesList: AirlineEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineService],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    repository = module.get<Repository<AirlineEntity>>(
      getRepositoryToken(AirlineEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    airlinesList = [];
    for (let i = 0; i < 5; i++) {
      const airline: AirlineEntity = await repository.save({
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
        website: faker.internet.url(),
        foundationDate: faker.date.past(),
      });
      airlinesList.push(airline);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airlines', async () => {
    const airlines: AirlineEntity[] = await service.findAll();
    expect(airlines).not.toBeNull();
    expect(airlines.length).toBe(5); // 5 airlines were seeded
  });

  it('findOne should return an airline by id', async () => {
    const storedAirline: AirlineEntity = airlinesList[0];
    const airline: AirlineEntity = await service.findOne(storedAirline.id);
    expect(airline).not.toBeNull();
    expect(airline.name).toEqual(storedAirline.name);
    expect(airline.description).toEqual(storedAirline.description);
  });

  it('findOne should throw an exception for an invalid airline', async () => {
    await expect(service.findOne('0')).rejects.toMatchObject(
      new BusinessLogicException(
        'The airline with the given ID was not found.',
        BusinessError.NOT_FOUND,
      ),
    );
  });

  it('create should successfully create a new airline', async () => {
    const airline: AirlineEntity = {
      id: '',
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      website: faker.internet.url(),
      foundationDate: faker.date.past(),
      airports: [],
    };
  
    const newAirline: AirlineEntity = await service.create(airline);
    expect(newAirline).not.toBeNull();
  
    const storedAirline: AirlineEntity = await repository.findOne({
      where: { id: newAirline.id },
    });
    expect(storedAirline).not.toBeNull();
    expect(storedAirline.name).toEqual(airline.name);
  });

  it('create should throw an exception when the foundation date is in the future', async () => {
    const airline: AirlineEntity = {
      id: '',
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      website: faker.internet.url(),
      foundationDate: faker.date.future(),
      airports: [],
    };
  
    await expect(() => service.create(airline)).rejects.toMatchObject(
      new BusinessLogicException(
        'The foundation date cannot be in the future',
        BusinessError.PRECONDITION_FAILED,
      ),
    );
  });

  it('update should modify an existing airline', async () => {
    const airline: AirlineEntity = airlinesList[0];
    airline.name = 'Updated Name';
    
    const updatedAirline: AirlineEntity = await service.update(airline.id, airline);
    expect(updatedAirline).not.toBeNull();
  
    const storedAirline: AirlineEntity = await repository.findOne({
      where: { id: airline.id },
    });
    expect(storedAirline.name).toEqual('Updated Name');
  });

  it('update should throw an exception for an invalid airline', async () => {
    const airline: AirlineEntity = {
      id: '0',
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      website: faker.internet.url(),
      foundationDate: faker.date.past(),
      airports: [],
    };
  
    await expect(() => service.update('0', airline)).rejects.toMatchObject(
      new BusinessLogicException(
        'The airline with the given ID was not found.',
        BusinessError.NOT_FOUND,
      ),
    );
  });

  it('update should throw an exception when the foundation date is in the future', async () => {
    const airline: AirlineEntity = airlinesList[0];
    airline.foundationDate = faker.date.future();
  
    await expect(() => service.update(airline.id, airline)).rejects.toMatchObject(
      new BusinessLogicException(
        'The foundation date cannot be in the future',
        BusinessError.PRECONDITION_FAILED,
      ),
    );
  });

  it('delete should remove an airline', async () => {
    const airline: AirlineEntity = airlinesList[0];
    await service.delete(airline.id);
  
    const deletedAirline: AirlineEntity = await repository.findOne({
      where: { id: airline.id },
    });
    expect(deletedAirline).toBeNull();
  });

  it('delete should throw an exception for an invalid airline', async () => {
    await expect(() => service.delete('0')).rejects.toMatchObject(
      new BusinessLogicException(
        'The airline with the given ID was not found.',
        BusinessError.NOT_FOUND,
      ),
    );
  });

});
