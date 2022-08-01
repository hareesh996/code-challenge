import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from '../model/common.model';

/**
 * A global exception handler to provide the output in a standard format.
 */
@Catch()
@Injectable()
export class ExceptionHandler implements ExceptionFilter {
  private readonly logger: Logger = new Logger('ExceptionHandler');

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const context = host.switchToHttp();

    let errorMessages: { errorCode: string; message: string }[] = [{ errorCode: 'common.unknownError', message: '' }];

    let status: HttpStatus;
    switch (true) {
      case exception instanceof HttpException:
        status = exception.getStatus();
        this.logger.error(`An HttpException, the response message for the exception is ${JSON.stringify(exception?.getResponse())}`);
        break;
      case exception instanceof Error:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        this.logger.error(`An unknown error has occurred. Message: [ ${exception?.message} ]`, exception?.stack as string);
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        this.logger.error(
          `An unknown exception, the name of the exception is [${exception?.name}]. And other details ${exception}, its prototype ${exception?.__proto__}`
        );
    }

    const responseBody: Response<void> = {
      status,
      messages: errorMessages.map((errorMessage) => {
        return {
          code: errorMessage.errorCode,
          text: errorMessage.message,
          type: 'error',
        };
      }),
      result: undefined,
    };

    httpAdapter.reply(context.getResponse(), responseBody, status);
  }

  getExceptionData(exception: any): unknown {
    try {
      return exception ? JSON.stringify(exception, Object.getOwnPropertyNames(exception)) : {}; // to get the proper exception with stacktrace
    } catch (e) {
      this.logger.error(`exception while constructing exception object ${JSON.stringify(e)}`);
      return {};
    }
  }
}
