import { Injectable } from '@nestjs/common';
import { DailyWeatherForecast } from '../../model/weather-forecast.model';
import { TDailyWeatherForecast, TTemperature } from '../entities/daily-forecast.entity';

/**
 * Mapper that helps to convert the entity details to model details and vice versa.
 *
 * TODO: Create an interface for the mapper.
 */
@Injectable()
export class TWeatherForecastMapper {
  mapToModel(tWeatherForecast: TDailyWeatherForecast): DailyWeatherForecast {
    return {
      lon: tWeatherForecast.lon,
      lat: tWeatherForecast.lat,
      forecastDate: tWeatherForecast.forecastDate,
      dailyForecast: tWeatherForecast.temperature.map((temperature) => {
        return {
          temperature: {
            value: temperature.celsTemperature,
            unit: 'celsius',
          },
          date: temperature.date,
        };
      }),
    };
  }

  mapToEntity(weatherForecast: DailyWeatherForecast): TDailyWeatherForecast {
    const tWeatherForecast: TDailyWeatherForecast = new TDailyWeatherForecast();
    tWeatherForecast.forecastDate = weatherForecast.forecastDate;
    (tWeatherForecast.lat = weatherForecast.lat),
      (tWeatherForecast.lon = weatherForecast.lon),
      (tWeatherForecast.temperature = weatherForecast.dailyForecast.map((dailyForecast) => {
        // TODO: We have to map the value of the celsius always, will have the converter later on.
        const temperature: TTemperature = new TTemperature();
        temperature.celsTemperature = dailyForecast.temperature.value;
        temperature.date = dailyForecast.date;
        return temperature;
      }));
    return tWeatherForecast;
  }
}
