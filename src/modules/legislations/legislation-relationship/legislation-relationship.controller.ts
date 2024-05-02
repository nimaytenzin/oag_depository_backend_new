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
import { LegislationRelationshipService } from './legislation-relationship.service';
import { CreateLegislationRelationshipDto } from './dto/create-legislation-relationship.dto';
import { UpdateLegislationRelationshipDto } from './dto/update-legislation-relationship.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { Roles } from 'src/modules/auth/roles.decorator';

@Controller('legislation-relationship')
export class LegislationRelationshipController {
  constructor(
    private readonly legislationRelationshipService: LegislationRelationshipService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Post()
  create(
    @Body() createLegislationRelationshipDto: CreateLegislationRelationshipDto,
  ) {
    return this.legislationRelationshipService.create(
      createLegislationRelationshipDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get()
  findAll() {
    return this.legislationRelationshipService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.legislationRelationshipService.findOne(+id);
  }
  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLegislationRelationshipDto: UpdateLegislationRelationshipDto,
  ) {
    return this.legislationRelationshipService.update(
      +id,
      updateLegislationRelationshipDto,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.legislationRelationshipService.remove(+id);
  }
}
