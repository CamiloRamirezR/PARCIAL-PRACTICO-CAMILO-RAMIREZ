import { Controller } from '@nestjs/common';
import { AirlineService } from './airline.service';

@Controller('airlines')
export class AirlineController {

    constructor (
        private readonly airlineService: AirlineService,
    ) {}
    
}
