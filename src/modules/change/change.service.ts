import { Inject, Injectable } from '@nestjs/common';
import { CreateChangeDto } from './dto/create-change.dto';
import { UpdateChangeDto } from './dto/update-change.dto';
import { Change } from './entities/change.entity';
import { ChangeValue } from '../change-value/entities/change-value.entity';
import { Amendment } from '../amendment/entities/amendment.entity';

@Injectable()
export class ChangeService {
  constructor(
    @Inject('CHANGE_REPOSITORY')
    private readonly changeRepository: typeof Change,
  ) {}

  create(createChangeDto: CreateChangeDto) {
    return this.changeRepository.create(createChangeDto);
  }
  findAllBySection(id: number) {
    return this.changeRepository.findAll({
      where: {
        sectionId: id,
      },
      include: [
        {
          model: ChangeValue,
        },
        {
          model: Amendment,
        },
      ],
    });
  }
}
