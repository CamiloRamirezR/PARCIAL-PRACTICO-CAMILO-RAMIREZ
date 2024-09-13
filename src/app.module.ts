import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirlineModule } from './airline/airline.module';

@Module({
  imports: [AirlineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
