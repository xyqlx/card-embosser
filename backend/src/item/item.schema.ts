import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

@Schema()
export class Item {
  @Prop({ required: true })
  itemId: number;

  @Prop({ required: true })
  images: string[];

  @Prop({ required: true })
  records: { time: Date; position: string }[];

  @Prop({ required: false, default: '' })
  description: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
