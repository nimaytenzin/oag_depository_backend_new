import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChangeValueService } from './change-value.service';
import { CreateChangeValueDto } from './dto/create-change-value.dto';
import { UpdateChangeValueDto } from './dto/update-change-value.dto';

@Controller('change-value')
export class ChangeValueController {
  constructor(private readonly changeValueService: ChangeValueService) {}

  @Post()
  create(@Body() createChangeValueDto: CreateChangeValueDto) {
    return this.changeValueService.create(createChangeValueDto);
  }
}
