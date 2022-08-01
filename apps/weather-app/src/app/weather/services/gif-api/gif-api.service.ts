import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { File } from '../../../shared/model/common.model';
import { GifAPIResponse } from './gif-api.model';

@Injectable()
export class GifApiService {
  constructor(private httpService: HttpService) {}

  /**
   * Get the Gif Response based on the tag name.
   * @param gifTagName
   * @returns
   */
  getGifByTagName(gifTagName: string): Promise<File> {
    const gifId = this.getGifIdByTagName(gifTagName);
    const gifResponse$: Observable<File> = this.httpService
      .get<GifAPIResponse>(`${environment.gifStudio.api}/${gifId}`, {
        params: {
          api_key: environment.gifStudio.apiKey,
        },
      })
      .pipe(
        map((gifApiResponse) => {
          const file: File = {
            fileType: 'gif',
            name: gifTagName,
            url: gifApiResponse.data.data.images.downsized_large.url,
          };
          return file;
        })
      );
    return firstValueFrom(gifResponse$);
  }

  private getGifIdByTagName(gitTag: string) {
    switch (gitTag.toLowerCase()) {
      case 'cold':
        return 'FskRngMv62d7UBmT7N';
      case 'hot':
        return 'd8zdiFGOSc6cIT5zww';
      default:
        throw new Error('Tag name is not identified by the application');
    }
  }
}
