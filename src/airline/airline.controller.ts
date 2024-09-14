import { Controller, UseInterceptors } from '@nestjs/common';
import { AirlineService } from './airline.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AirlineController {

    constructor (
        private readonly airlineService: AirlineService,
    ) {}

}
