import { Controller, Get, Query } from '@nestjs/common';
import { File, mapResponse, Response } from '../../../shared/model/common.model';
import { GifApiService } from '../../services/gif-api/gif-api.service';
import { WeatherService } from '../../services/weather/weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService, private gifApiService: GifApiService) {}

  @Get()
  getWeatherForecast(@Query('lon') lon: number, @Query('lat') lat: number): Promise<Response<File>> {
    return this.weatherService.getWeatherForecast(lon, lat).then((dailyWeatherForecast) => {
      let tagName = 'cold';
      if (dailyWeatherForecast.dailyForecast[0].temperature.value < dailyWeatherForecast.dailyForecast[1].temperature.value) {
        tagName = 'hot';
      }
      return this.gifApiService.getGifByTagName(tagName).then(mapResponse());
    });
  }
}
