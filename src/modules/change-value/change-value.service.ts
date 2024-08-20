import { Inject, Injectable } from '@nestjs/common';
import { CreateChangeValueDto } from './dto/create-change-value.dto';
import { UpdateChangeValueDto } from './dto/update-change-value.dto';
import { ChangeValue } from './entities/change-value.entity';

@Injectable()
export class ChangeValueService {
  constructor(
    @Inject('CHANGE_VALUE_REPOSITORY')
    private readonly changeValueRepository: typeof ChangeValue,
  ) {}
  create(createChangeValueDto: CreateChangeValueDto) {
    console.log('\n*********************POST CHANGE VALUES *************\n');
    console.log(createChangeValueDto);
    console.log('\n*********************POST CHANGE VALUES *************\n');

    return this.changeValueRepository.create(createChangeValueDto);
  }
}
