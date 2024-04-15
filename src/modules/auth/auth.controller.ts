import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignUpDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() user) {
    console.log('LOGIN REQUEST RECEIVED');
    return await this.authService.authenticateUser(user);
  }

  @Post('signup')
  async signUp(@Body() user: UserSignUpDto) {
    return await this.authService.createUser(user);
  }
}
