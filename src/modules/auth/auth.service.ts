import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/login-response.dto';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { UserSignUpDto } from './dto/register.dto';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

export interface UserJwtPayload {
  email: string;
  fullName: string;
  role: string;
  id: number;
}

@Injectable()
export class AuthService {
  constructor(
    private _userService: UsersService,
    private _jwtService: JwtService,
  ) {}

  public async authenticateUser(userData: LoginDto): Promise<AuthResponseDto> {
    const user = await this.findUser(userData.email);
    if (user) {
      this.validatePassword(userData.password, user.password);
      const payload: UserJwtPayload = {
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        id: user.id,
      };
      const token = this.generateToken(payload);
      return {
        statusCode: HttpStatus.OK,
        message: 'User Authenticated',
        token: token,
      };
    } else {
      throw new HttpException(
        'Email is wrong or not registered',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private generateToken(user) {
    // return this._jwtService.sign(user, { secret: '12312323' });
    return this._jwtService.sign(user, {
      expiresIn: '8h',
      secret: '12312323',
    });
  }

  private async findUser(email: string) {
    return await this._userService.findOneByEmail(email);
  }

  public async createUser(user: UserSignUpDto) {
    try {
      const userExists = await this._userService.findOneByEmail(user.email);

      if (userExists) {
        throw new HttpException(
          'User with the Email is already registered',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const newUserData: CreateUserDto = {
          email: user.email,
          password: await this.hashPassword(user.password),
          role: user.role,
          fullName: user.fullName,
        };
        const newUser = await this._userService.create(newUserData);
        if (newUser) {
          return {
            statusCode: HttpStatus.CREATED,
            message: 'A new user account has been created!',
          };
        } else {
          throw new HttpException(
            'User failed to create',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    } catch (error) {
      throw error;
    }
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  private validatePassword(enteredPassword, dbPassword) {
    console.log('\nComparing Passowrds\n');
    console.log(enteredPassword, dbPassword);
    if (!bcrypt.compareSync(enteredPassword, dbPassword)) {
      throw new HttpException(
        'Incorrect Password. Please try again.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async validateUserwithToken(token) {
    try {
      return await this._jwtService.verify(token, { secret: '12312323' });
    } catch (error) {
      console.log('\n\nERROR', error, '\n\n');

      throw new ForbiddenException(error);
      return error;
    }
  }
}
