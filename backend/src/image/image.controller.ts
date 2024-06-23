import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { Response } from 'express';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('thumbnail/:id')
  async findThumbnail(@Param('id') id: string, @Res() res: Response) {
    const image = await this.imageService.findOneFull(id);
    const thumbnailData = image.thumbnail;
    const contentType = 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.write(thumbnailData);
  }

  @Get(':id')
  async findImage(@Param('id') id: string, @Res() res: Response) {
    const image = await this.imageService.findOneFull(id);
    const imageData = image.data;
    const contentType = image.contentType;
    res.setHeader('Content-Type', contentType);
    res.write(imageData);
  }

  @Get('used/:id')
  async findUsed(@Param('id') id: string) {
    const image = await this.imageService.findOne(id);
    return image.used;
  }

  @Get('detail/:id')
  find(@Param('id') id: string) {
    return this.imageService.findOne(id);
  }

  @Post('use/:id')
  setUsed(@Param('id') id: string) {
    return this.imageService.setUsed(id, true);
  }

  @Post('unuse/:id')
  setUnused(@Param('id') id: string) {
    return this.imageService.setUsed(id, false);
  }

  // get latest unused images
  @Get('unused/desc/:count')
  getLatest(@Param('count') count: string) {
    return this.imageService.getUnused(parseInt(count), false);
  }

  // get unused images by id ascending
  @Get('unused/asc/:count')
  getUnused(@Param('count') count: string) {
    return this.imageService.getUnused(parseInt(count), true);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.imageService.delete(id);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1024 },
      { name: 'thumbnail', maxCount: 1024 },
    ]),
  )
  async create(
    @UploadedFiles()
    files: {
      image: Express.Multer.File[];
      thumbnail: Express.Multer.File[];
    },
  ) {
    const images = files.image;
    const thumbnails = files.thumbnail;
    if (images.length !== thumbnails.length) {
      throw new Error('Image and thumbnail count mismatch');
    }
    // save images
    return Promise.all(
      images.map((v, i) => this.imageService.create(v, thumbnails[i])),
    );
  }
}
