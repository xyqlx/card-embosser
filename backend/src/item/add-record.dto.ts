export class AddRecordDto {
  readonly ids: string[];
  readonly records: { time: Date; position: string }[];
}
