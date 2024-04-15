import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ViewCountService } from './view-count.service';
import { CreateViewCountDto } from './dto/create-view-count.dto';
import { UpdateViewCountDto } from './dto/update-view-count.dto';

@Controller('view-count')
export class ViewCountController {
  constructor(private readonly viewCountService: ViewCountService) {}

  @Post()
  create(@Body() createViewCountDto: CreateViewCountDto) {
    return this.viewCountService.create(createViewCountDto);
  }

  @Get()
  findAll() {
    return this.viewCountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.viewCountService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateViewCountDto: UpdateViewCountDto) {
    return this.viewCountService.update(+id, updateViewCountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.viewCountService.remove(+id);
  }
}
