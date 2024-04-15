import { Injectable } from '@nestjs/common';
import { CreateViewCountDto } from './dto/create-view-count.dto';
import { UpdateViewCountDto } from './dto/update-view-count.dto';

@Injectable()
export class ViewCountService {
  create(createViewCountDto: CreateViewCountDto) {
    return 'This action adds a new viewCount';
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
