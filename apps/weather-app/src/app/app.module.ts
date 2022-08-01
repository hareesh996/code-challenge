import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/shared.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot({
      ...environment.dbConfig,
    }),
    SharedModule,
    WeatherModule,
  ],
})
export class AppModule {}
