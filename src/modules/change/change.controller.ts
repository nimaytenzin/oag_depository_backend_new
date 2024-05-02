import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ChangeService } from './change.service';
import { CreateChangeDto } from './dto/create-change.dto';
import { UpdateChangeDto } from './dto/update-change.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('change')
export class ChangeController {
  constructor(private readonly changeService: ChangeService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Post()
  create(@Body() createChangeDto: CreateChangeDto) {
    return this.changeService.create(createChangeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get('/section/all/:id')
  findOne(@Param('id') id: string) {
    return this.changeService.findAllBySection(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get('/amendment/:id')
  findAllByAmendemnt(@Param('id') id: string) {
    return this.changeService.findAllByAmendment(+id);
  }
}
