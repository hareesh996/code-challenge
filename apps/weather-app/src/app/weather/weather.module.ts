import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherController } from './controllers/weather/weather.controller';
import { TDailyWeatherForecast, TTemperature } from './dao/entities/daily-forecast.entity';
import { TWeatherForecastMapper } from './dao/mappers/tweather-forecast.mapper';
import { WeatherDaoService } from './dao/open-weather-dao/open-weather-dao.service';
import { GifApiService } from './services/gif-api/gif-api.service';
import { OpenWeatherApiService } from './services/open-weather-api/open-weather-api.service';
import { WeatherService } from './services/weather/weather.service';

@Module({
  imports: [TypeOrmModule.forFeature([TDailyWeatherForecast, TTemperature])],
  controllers: [WeatherController],
  providers: [WeatherService, OpenWeatherApiService, WeatherDaoService, TWeatherForecastMapper, GifApiService],
})
export class WeatherModule {}
