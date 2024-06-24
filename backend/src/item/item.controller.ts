import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './create-item.dto';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  async create(@Body() item: CreateItemDto) {
    return this.itemService.create(item);
  }

  @Get('/latest/:count')
  async findLatest(@Body() count: number) {
    return this.itemService.findLatest(count);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.itemService.delete(id);
  }

  @Get('/last-position')
  async findLastPosition() {
    return this.itemService.findLastPosition();
  }
}