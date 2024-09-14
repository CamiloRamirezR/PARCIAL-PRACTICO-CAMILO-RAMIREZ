import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { AirportService } from './airport.service';
import { AirportDto } from './airport.dto';
import { AirportEntity } from './airport.entity';
import { plainToInstance } from 'class-transformer';

@Controller('airports')
@UseInterceptors(BusinessErrorsInterceptor)
export class AirportController {

    constructor (
        private readonly airportService: AirportService,
    ) {}

    @Get()
    async findAll() {
        return this.airportService.findAll();
    }

    @Get(':airportId')
    async findOne(
        @Param('airportId') airportId: string,
    ) {
        return await this.airportService.findOne(airportId);
    }

    @Post()
    async create(
        @Body() airportDto: AirportDto,
    ) {
        const airport: AirportEntity = plainToInstance(AirportEntity, airportDto);
        return await this.airportService.create(airport);
    }

    @Put(':airportId')
    async update(
        @Param('airportId') airportId: string,
        @Body() airportDto: AirportDto,
    ) {
        const airport: AirportEntity = plainToInstance(AirportEntity, airportDto);
        return await this.airportService.update(airportId, airport);
    }

    @Delete(':airportId')
    @HttpCode(204)
    async delete(
        @Param('airportId') airportId: string,
    ) {
        return await this.airportService.delete(airportId);
    }    
}
