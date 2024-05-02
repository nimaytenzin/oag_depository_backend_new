import { Inject, Injectable } from '@nestjs/common';
import { CreateViewCountDto } from './dto/create-view-count.dto';
import { UpdateViewCountDto } from './dto/update-view-count.dto';
import { ViewCount } from './entities/view-count.entity';

@Injectable()
export class ViewCountService {
  constructor(
    @Inject('VIEWCOUNT_REPO')
    private readonly repo: typeof ViewCount,
  ) {}
  async create(createViewCountDto: CreateViewCountDto) {
    return await this.repo.create(createViewCountDto);
  }

  findAll() {
    return `This action returns all viewCount`;
  }

  findOne(id: number) {
    return `This action returns a #${id} viewCount`;
  }

  update(id: number, updateViewCountDto: UpdateViewCountDto) {
    return `This action updates a #${id} viewCount`;
  }

  remove(id: number) {
    return `This action removes a #${id} viewCount`;
  }
}
