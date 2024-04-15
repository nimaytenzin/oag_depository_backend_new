import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParentDocumentService } from './parent-document.service';
import { CreateParentDocumentDto } from './dto/create-parent-document.dto';
import { UpdateParentDocumentDto } from './dto/update-parent-document.dto';

@Controller('parent-document')
export class ParentDocumentController {
  constructor(private readonly parentDocumentService: ParentDocumentService) {}

  @Post()
  create(@Body() createParentDocumentDto: CreateParentDocumentDto) {
    return this.parentDocumentService.create(createParentDocumentDto);
  }

  @Get()
  findAll() {
    return this.parentDocumentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parentDocumentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParentDocumentDto: UpdateParentDocumentDto) {
    return this.parentDocumentService.update(+id, updateParentDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parentDocumentService.remove(+id);
  }
}
