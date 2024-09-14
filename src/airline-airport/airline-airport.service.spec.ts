import { Test, TestingModule } from '@nestjs/testing';
import { AirlineAirportService } from './airline-airport.service';

describe('AirlineAirportService', () => {
  let service: AirlineAirportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirlineAirportService],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
