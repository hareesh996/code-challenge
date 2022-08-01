import { Injectable, Logger } from '@nestjs/common';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';
import { TypeORMDBHelper } from '../../../shared/services/typeorm-dbhelper';
import { DailyWeatherForecast } from '../../model/weather-forecast.model';
import { TDailyWeatherForecast } from '../entities/daily-forecast.entity';
import { TWeatherForecastMapper } from '../mappers/tweather-forecast.mapper';

@Injectable()
export class WeatherDaoService {
  private log: Logger = new Logger(WeatherDaoService.name);

  constructor(private dbHelper: TypeORMDBHelper, private tWeatherForecastMapper: TWeatherForecastMapper) {}

  /**
   * Save weather forecast details against
   * @param lon
   * @param lat
   * @param date
   */
  saveWeatherForecast(forecastDate: Date, weatherForecast: DailyWeatherForecast): Promise<DailyWeatherForecast> {
    this.log.debug(
      `Saving the forecast details for the date ${forecastDate.toISOString()} having lang [${weatherForecast.lat}] and lat [${
        weatherForecast.lat
      }]`
    );

    const tWeatherForecast: TDailyWeatherForecast = this.tWeatherForecastMapper.mapToEntity(weatherForecast);
    return this.dbHelper
      .insertQueryBuilder()
      .into(TDailyWeatherForecast)
      .values(tWeatherForecast)
      .useTransaction(true)
      .execute()
      .then((result) => weatherForecast);
  }

  /**
   * Get the weather forecast details for the given date, longitude, latitude.
   * @param lon
   * @param lat
   * @param forecastDate
   */
  getWeatherForecast(lon: number, lat: number, forecastDate: Date = new Date()): Promise<DailyWeatherForecast> {
    return this.dbHelper
      .queryBuilder(TDailyWeatherForecast, 'weather')
      .leftJoinAndSelect('weather.temperature', 'temperature')
      .where('weather.lon = :lon', { lon })
      .andWhere('weather.lat = :lat', { lat })
      .andWhere('weather.forecastDate = :forecastDate', {
        forecastDate: format(forecastDate, 'yyyy-MM-dd'),
      })
      .orderBy('temperature.date', 'ASC')
      .getOne()
      .then((tWeatherForecast) => {
        if (isEmpty(tWeatherForecast)) {
          this.log.debug(
            `We did not find the forecast details for the provided details: date [${forecastDate.toISOString()}, lon [${lon}] and lat [${lat}]`
          );
          return null;
        }
        this.log.debug(
          `retrieved the forecast details for the date ${forecastDate.toISOString()} having lang [${tWeatherForecast.lat}] and lat [${
            tWeatherForecast.lat
          }]`
        );
        return this.tWeatherForecastMapper.mapToModel(tWeatherForecast);
      });
  }
}
