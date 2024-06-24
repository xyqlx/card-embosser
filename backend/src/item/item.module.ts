import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './item.schema';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    ImageModule,
  ],
  providers: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}
