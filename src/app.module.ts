import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirlineModule } from './airline/airline.module';
import { AirportModule } from './airport/airport.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AirportEntity } from './airport/airport.entity';
import { AirlineEntity } from './airline/airline.entity';


function databaseConfigFromEnv(): TypeOrmModuleOptions {
  const url = new URL(process.env.DATABASE_URL);
  const scheme = url.protocol.slice(0, -1);

  if (scheme === 'sqlite') {
    return {
      type: 'sqlite',
      database: url.pathname || url.host,
    };
  }

  if (scheme === 'postgres') {
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
    };
  }

  throw new Error('Invalid database URL');
}


@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...databaseConfigFromEnv(),
      entities: [
        AirportEntity,
        AirlineEntity,
      ],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    AirlineModule,
    AirportModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
