import { Controller, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { AirportService } from './airport.service';

@Controller('airport')
@UseInterceptors(BusinessErrorsInterceptor)
export class AirportController {

    constructor (
        private readonly airportService: AirportService,
    ) {}
    
}
