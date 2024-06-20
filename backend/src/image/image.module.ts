import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageSchema, ItemImage } from './image.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ItemImage.name, schema: ImageSchema }]),
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
