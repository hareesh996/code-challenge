import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export type APIResponseType = 'json' | 'file-inline' | 'file-download';

export type MessageType = 'info' | 'error';

export class Message {
  @ApiProperty()
  code: string;

  @ApiProperty()
  text?: string;

  @ApiProperty({
    enum: ['info', 'error'],
  })
  type: MessageType;

  constructor(text?: string, type?: MessageType, code?: string) {
    this.text = text;
    this.type = type;
    this.code = code;
  }
}

/**
 * Standard Response Structure for all the API's
 */
export class Response<T> {
  @Exclude()
  responseType?: APIResponseType;

  constructor(result?: T, httpStatus = HttpStatus.ACCEPTED) {
    this.result = result;
    this.status = httpStatus;
    this.responseType = 'json';
  }

  result: T;

  @ApiProperty({
    enum: HttpStatus,
    enumName: 'HttpStatus',
  })
  status: HttpStatus;

  @ApiProperty({
    type: Message,
    isArray: true,
  })
  messages?: Message[];
}

export class DocumentResponse<T extends File> extends Response<T> {
  constructor(document: T, httpStatus = HttpStatus.ACCEPTED) {
    super(document, httpStatus);
    this.responseType = 'file-inline';
  }
}

export type FileType = 'pdf' | 'doc' | 'json' | 'image' | 'gif';

export interface File {
  name?: string;
  fileType?: FileType;
  url?: string;
  file?: Buffer;
}

export const mapResponse = function <T>(status: HttpStatus = HttpStatus.OK, messages?: Message[]) {
  return (result: T): Response<T> => {
    return {
      responseType: 'json',
      result,
      status,
      messages,
    };
  };
};
