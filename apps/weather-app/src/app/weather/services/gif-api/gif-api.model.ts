export interface GifAPIResponse {
  data: Data;
}

export interface Data {
  type: string;
  id: string;
  url: string;
  images: Images;
}

export interface Images {
  downsized_large: DownsizedLarge;
}

export interface DownsizedLarge {
  height: string;
  size: string;
  url: string;
  width: string;
}
