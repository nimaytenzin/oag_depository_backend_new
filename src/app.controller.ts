import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { USERROLES } from './constants/enums';
import { JwtAuthGuard } from './modules/auth/jwt.auth.guard';
import { Roles } from './modules/auth/roles.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles([USERROLES.SUPERADMIN])
  getHello(): string {
    return this.appService.getHello();
  }
}
