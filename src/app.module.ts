import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirlineModule } from './airline/airline.module';
import { AirportModule } from './airport/airport.module';

@Module({
  imports: [AirlineModule, AirportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
