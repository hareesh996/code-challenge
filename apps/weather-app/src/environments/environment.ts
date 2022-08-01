import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const dbConfig: TypeOrmModuleOptions = {
  type: 'better-sqlite3',
  database: ':memory:',
  dropSchema: true,
  autoLoadEntities: true,
  synchronize: true,
};

export const environment = {
  production: false,
  openWeather: {
    api: 'https://api.openweathermap.org/data/2.5/forecast/daily',
    apiKey: '148499c5f7be26930ba48e57b6faf35c',
  },
  gifStudio: {
    api: 'https://api.giphy.com/v1/gifs',
    apiKey: 'K4Ugw8djsKdU486m0NWxy1NedvqjFq1c',
  },
  dbConfig,
};
