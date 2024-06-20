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
    const image = await this.imageService.findOne(id);
    const thumbnailData = image.thumbnail;
    const contentType = 'image/jpeg';
    const file = createReadStream(thumbnailData);
    res.setHeader('Content-Type', contentType);
    file.pipe(res);
  }

  @Get(':id')
  async findImage(@Param('id') id: string, @Res() res: Response) {
    const image = await this.imageService.findOne(id);
    const imageData = image.data;
    const contentType = image.contentType;
    const file = createReadStream(imageData);
    res.setHeader('Content-Type', contentType);
    file.pipe(res);
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
      { name: 'image', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
  )
  create(
    @UploadedFiles()
    files: {
      image: Express.Multer.File[];
      thumbnail: Express.Multer.File[];
    },
  ) {
    const image = files.image ? files.image[0] : null;
    const thumbnail = files.thumbnail ? files.thumbnail[0] : null;
    // check if files are present
    if (!image || !thumbnail) {
      throw new Error('Image or thumbnail not found');
    }
    // save images
    return this.imageService.create(image, thumbnail);
  }
}
