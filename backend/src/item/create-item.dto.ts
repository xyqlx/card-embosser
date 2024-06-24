export class CreateItemDto {
  readonly images: string[];
  readonly records: { time: Date; position: string }[];
  readonly description: string;
}
