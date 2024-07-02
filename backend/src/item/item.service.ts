import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './item.schema';
import { Model } from 'mongoose';
import { CreateItem } from './create-item.schema';
import { ImageService } from 'src/image/image.service';
import { ExplainVerbosity } from 'mongodb';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<Item>,
    private readonly imageService: ImageService,
  ) {}

  async create(item: CreateItem): Promise<Item> {
    const newItem = new this.itemModel(item);
    // TODO 检查是否有更好的自增方法
    // set increment itemId (by find max itemId and add 1)
    const maxItemId = await this.itemModel
      .find()
      .sort({ itemId: -1 })
      .limit(1)
      .exec();
    newItem.itemId = maxItemId.length > 0 ? maxItemId[0].itemId + 1 : 1;
    // set images to used
    if (newItem.images) {
      await this.imageService.setUsedMany(newItem.images, true);
    }
    return newItem.save();
  }

  async findAll(): Promise<Item[]> {
    return this.itemModel.find().exec();
  }

  async findLatest(count: number): Promise<Item[]> {
    // find the latest items
    return this.itemModel.find().sort({ _id: -1 }).limit(count).exec();
  }

  async findByDescription(text: string): Promise<Item[]> {
    // find all items that contain the text in their description
    return this.itemModel
      .find({
        description: { $regex: text, $options: 'i' },
      })
      .exec();
  }

  async findByPosition(text: string): Promise<Item[]> {
    // find all items that contain the text in their position records
    return this.itemModel
      .find({
        'records.position': { $regex: text, $options: 'i' },
      })
      .exec();
  }

  async findOne(id: string): Promise<Item> {
    return this.itemModel.findById(id);
  }

  async update(id: string, item: Item): Promise<Item> {
    return this.itemModel.findByIdAndUpdate(id, item, { new: true });
  }

  async delete(id: string): Promise<Item> {
    // release all images used by the item
    const item = await this.itemModel.findById(id);
    if (item.images) {
      await this.imageService.setUsedMany(item.images, false);
    }
    return this.itemModel.findByIdAndDelete(id);
  }

  async deleteMany(ids: string[]): Promise<void> {
    // release all images used by the items
    const items = await this.itemModel.find({ _id: { $in: ids } });
    const imageIds = items.reduce((acc, cur) => {
      if (cur.images) {
        acc.push(...cur.images);
      }
      return acc;
    }, []);
    await this.imageService.setUsedMany(imageIds, false);
    await this.itemModel.deleteMany({ _id: { $in: ids } }).exec();
  }

  async addRecords(ids: string[], records: { time: Date; position: string }[]) {
    await this.itemModel.updateMany(
      { _id: { $in: ids } },
      { $push: { records: { $each: records } } },
    );
  }

  async findLastPosition(): Promise<string> {
    const items = await this.itemModel
      .find()
      .sort({ 'records.time': -1 })
      .limit(1)
      .exec();
    // join with new line
    if (items.length === 0) {
      return '';
    }
    return items[0].records.map((record) => record.position).join('\n');
  }

  async modifyPosition(ids: string[], position: string): Promise<void> {
    // find and then update the position of last element in record array
    const items = await this.itemModel.find({ _id: { $in: ids } });
    const updateActions = items.map((item) => {
      const lastRecord = item.records[item.records.length - 1];
      lastRecord.position = position;
      return {
        updateOne: {
          filter: { _id: item._id },
          update: { records: item.records },
        },
      };
    });
    await this.itemModel.bulkWrite(updateActions);
    // I don't know why save of bulkSave not work
  }
}
