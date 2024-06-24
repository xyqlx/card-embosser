import { Injectable } from '@nestjs/common';
import { ItemImage } from './image.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateImageDto } from './create-image.dto';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(ItemImage.name) private imageModel: Model<ItemImage>,
  ) {}

  async create(
    image: Express.Multer.File,
    thumbnail: Express.Multer.File,
  ): Promise<ItemImage> {
    // create imageDto
    const imageDto: CreateImageDto = {
      contentType: image.mimetype,
      data: image.buffer,
      thumbnail: thumbnail.buffer,
      used: false,
    };
    const newImage = new this.imageModel(imageDto);
    return newImage.save();
  }

  async findAll(): Promise<ItemImage[]> {
    return this.imageModel.find().select('-data').select('-thumbnail').exec();
  }

  async findOne(id: string): Promise<ItemImage> {
    return this.imageModel.findById(id).select('-data').select('-thumbnail');
  }

  async findOneFull(id: string): Promise<ItemImage> {
    return this.imageModel.findById(id);
  }

  async setUsed(id: string, used: boolean): Promise<ItemImage> {
    return this.imageModel.findByIdAndUpdate(id, { used }, { new: true });
  }

  async getUnused(count: number, asc: boolean): Promise<ItemImage[]> {
    return this.imageModel
      .find({ used: false })
      .select('-data')
      .select('-thumbnail')
      .sort({ _id: asc ? 1 : -1 })
      .limit(count)
      .exec();
  }

  async delete(id: string): Promise<ItemImage> {
    return this.imageModel.findByIdAndDelete(id);
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.imageModel.deleteMany({ _id: { $in: ids } }).exec();
  }
}
