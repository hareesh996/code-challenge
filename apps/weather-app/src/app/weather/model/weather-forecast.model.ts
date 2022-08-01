export interface DailyWeatherForecast {
  lon: number;
  lat: number;
  forecastDate: Date;
  dailyForecast: DailyForecast[];
}

export interface DailyForecast {
  temperature: Temperature;
  date: Date;
}

export interface Temperature {
  value: number;
  unit: TemperatureUnit;
}

export type TemperatureUnit = 'celsius' | 'kelvin';
