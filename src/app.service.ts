import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'If you can see this it means you are a super admin';
  }
}
