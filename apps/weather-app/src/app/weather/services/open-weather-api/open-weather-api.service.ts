import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { firstValueFrom, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DailyWeatherForecast } from '../../model/weather-forecast.model';
import { OpenWDailyForecastResponse } from './daily-forecast.model';

/**
 * An Openweather API that interacts with the external weather api to get the weather information.
 */
@Injectable()
export class OpenWeatherApiService {
  private log: Logger = new Logger(OpenWeatherApiService.name);

  constructor(private httpService: HttpService) {}

  /**
   * Get the daily weather forecast for the give number of days, longitude, latitude
   *
   * @param numberOfDays maximum of 15 is allowed to retrieve the details.
   */
  getDailyWeatherForecast(lon: number, lat: number, numberOfDays: number): Promise<DailyWeatherForecast> {
    const openWeatherAPI$: Observable<DailyWeatherForecast> = this.httpService
      .get<OpenWDailyForecastResponse>(environment.openWeather.api, {
        params: {
          appid: environment.openWeather.apiKey,
          lon,
          lat,
          unit: 'metric',
          cnt: numberOfDays,
        },
      })
      .pipe(
        map((response) => {
          if (isEmpty(response.data)) {
            return null;
          }
          this.log.debug(`retrieved the forecast details for lon [${lon}] and lat [${lat}]`);
          this.log.verbose(`Forecast details are [ ${response.data} ]`);
          return this.mapResponseToWeatherForecast(lat, lon, response);
        })
      );

    return firstValueFrom(openWeatherAPI$);
  }

  /**
   * Map the open weather response to app understandable java model class.
   * @param lat
   * @param lon
   * @param response
   * @returns
   */
  private mapResponseToWeatherForecast(lat: number, lon: number, response): DailyWeatherForecast {
    return {
      lat,
      lon,
      forecastDate: new Date(),
      dailyForecast: response.data.list.map((value) => {
        return {
          date: new Date(value.dt * 1000),
          temperature: {
            // TODO: Considering the day temperature
            value: value.temp.day,
            unit: 'celsius',
          },
        };
      }),
    };
  }
}
