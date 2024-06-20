import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ImageDocument = HydratedDocument<ItemImage>;

@Schema()
export class ItemImage {
  @Prop({ required: true })
  contentType: string;

  @Prop({ required: true })
  data: Buffer;

  // thumbnail is a smaller version of the image using jpeg format
  @Prop({ required: true })
  thumbnail: Buffer;

  @Prop({ default: true })
  used: boolean;
}

export const ImageSchema = SchemaFactory.createForClass(ItemImage);
