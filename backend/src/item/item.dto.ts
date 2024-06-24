export class ItemDto {
  readonly itemId: number;
  readonly images: string[];
  readonly records: { time: Date; position: string }[];
  readonly description: string;
}
