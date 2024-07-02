import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './create-item.dto';
import { ItemIdsDto } from './item-Ids.dto';
import { AddRecordDto } from './add-record.dto';
import { IdsPositionDto } from './ids-position.dto';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  async create(@Body() item: CreateItemDto) {
    return this.itemService.create(item);
  }

  @Get('/latest/:count')
  async findLatest(@Param('count') count: number) {
    return this.itemService.findLatest(count);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.itemService.delete(id);
  }

  @Delete()
  async deleteMany(@Body() ids: ItemIdsDto) {
    return this.itemService.deleteMany(ids.ids);
  }

  @Get('last-position')
  async findLastPosition() {
    return this.itemService.findLastPosition();
  }

  // add record to any items
  @Post('record')
  async addRecord(@Body() doc: AddRecordDto) {
    return this.itemService.addRecords(doc.ids, doc.records);
  }

  @Post('modify-position')
  async modifyPosition(@Body() doc: IdsPositionDto) {
    return this.itemService.modifyPosition(doc.ids, doc.position);
  }
}
