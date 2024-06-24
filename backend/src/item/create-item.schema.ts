import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CreateItemDocument = HydratedDocument<CreateItem>;

@Schema()
export class CreateItem {
  @Prop({ required: true })
  images: string[];

  @Prop({ required: true })
  records: { time: Date; position: string }[];

  @Prop({ required: false, default: '' })
  description: string;
}

export const CreateItemSchema = SchemaFactory.createForClass(CreateItem);
