export class CreateImageDto {
  readonly contentType: string;
  readonly data: Buffer;
  readonly thumbnail: Buffer;
  readonly used: boolean;
}
