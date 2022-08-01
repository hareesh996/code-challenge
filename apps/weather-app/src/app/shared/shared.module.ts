import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionHandler } from './services/exception-handler.filter';
import { TypeORMDBHelper } from './services/typeorm-dbhelper';

const COMMON_PROVIDERS = [TypeORMDBHelper];

@Global()
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionHandler,
    },
    ...COMMON_PROVIDERS,
  ],
  exports: [...COMMON_PROVIDERS],
})
export class SharedModule {}
