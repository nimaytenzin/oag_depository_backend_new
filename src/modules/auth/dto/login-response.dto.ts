import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AuthResponseDto {
  statusCode: number;
  message: string;
  token: string;
}
