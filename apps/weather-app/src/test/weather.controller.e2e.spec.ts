import { HttpModule } from '@nestjs/axios';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { parse } from 'date-fns';
import * as request from 'supertest';
import { File } from '../app/shared/model/common.model';
import { SharedModule } from '../app/shared/shared.module';
import { WeatherController } from '../app/weather/controllers/weather/weather.controller';
import { TDailyWeatherForecast, TTemperature } from '../app/weather/dao/entities/daily-forecast.entity';
import { TWeatherForecastMapper } from '../app/weather/dao/mappers/tweather-forecast.mapper';
import { WeatherDaoService } from '../app/weather/dao/open-weather-dao/open-weather-dao.service';
import { DailyWeatherForecast } from '../app/weather/model/weather-forecast.model';
import { GifApiService } from '../app/weather/services/gif-api/gif-api.service';
import { OpenWeatherApiService } from '../app/weather/services/open-weather-api/open-weather-api.service';
import { WeatherService } from '../app/weather/services/weather/weather.service';
import { environment } from '../environments/environment';

describe('WeatherController (e2e)', () => {
  let app: INestApplication;

  // @ts-ignore
  const openWeatherService: OpenWeatherApiService = {
    getDailyWeatherForecast: (lon: number, lat: number, numberOfDays: number): Promise<DailyWeatherForecast> => {
      return new Promise((resolve) => {
        // longitude is equal to 300, then its hot for next day.
        const HOT_LONGITUDE_VALUE = '300';
        resolve({
          dailyForecast: [
            {
              date: parse('2022-07-30', 'yyyy-MM-dd', new Date()),
              temperature: {
                unit: 'celsius',
                value: 30,
              },
            },
            {
              date: parse('2022-07-31', 'yyyy-MM-dd', new Date()),
              temperature: {
                unit: 'celsius',
                value: lon.toString() === HOT_LONGITUDE_VALUE ? 32 : 22,
              },
            },
          ],
          lon,
          lat,
          forecastDate: parse('2022-07-30', 'yyyy-MM-dd', new Date()),
        });
      });
    },
  };

  // @ts-ignore
  const gifService: GifApiService = {
    getGifByTagName: (tagName: string): Promise<File> => {
      return new Promise((resolve) => {
        resolve({
          name: tagName,
          url: `/gif-image-url/${tagName}`,
        });
      });
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        TypeOrmModule.forRoot({
          ...environment.dbConfig,
          entities: [TDailyWeatherForecast, TTemperature],
        }),
        SharedModule,
      ],
      controllers: [WeatherController],
      providers: [WeatherService, OpenWeatherApiService, WeatherDaoService, TWeatherForecastMapper, GifApiService],
    })
      .overrideProvider(OpenWeatherApiService)
      .useValue(openWeatherService)
      .overrideProvider(GifApiService)
      .useValue(gifService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('Test HOT temperature: /weather', () => {
    return request(app.getHttpServer())
      .get('/weather?lon=300&lat=200')
      .expect(200)
      .expect({ responseType: 'json', result: { name: 'hot', url: '/gif-image-url/hot' }, status: 200 });
  });

  it('Test COLD temperature: /weather', () => {
    return request(app.getHttpServer())
      .get('/weather?lon=320&lat=200')
      .expect(200)
      .expect({ responseType: 'json', result: { name: 'cold', url: '/gif-image-url/cold' }, status: 200 });
  });
});
