import { Injectable, Logger } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { WeatherDaoService } from '../../dao/open-weather-dao/open-weather-dao.service';
import { DailyWeatherForecast } from '../../model/weather-forecast.model';
import { OpenWeatherApiService } from '../open-weather-api/open-weather-api.service';

@Injectable()
export class WeatherService {
  private log: Logger = new Logger(WeatherService.name);

  constructor(private weatherAPIService: OpenWeatherApiService, private weatherDaoService: WeatherDaoService) {}

  /**
   * Get weather forecast details for today and tomorrow.
   */
  getWeatherForecast(lon: number, lat: number): Promise<DailyWeatherForecast> {
    return this.weatherDaoService.getWeatherForecast(lon, lat).then((weatherForecastDB) => {
      if (isEmpty(weatherForecastDB)) {
        this.log.log(`No, weather details for the given lon [${lon}], lat [${lat}], found in db, will get from the Open Weather API`);
        return this.weatherAPIService.getDailyWeatherForecast(lon, lat, 2).then((weatherForecast) => {
          return this.weatherDaoService.saveWeatherForecast(weatherForecast.forecastDate, weatherForecast);
        });
      }
      return weatherForecastDB;
    });
  }
}
