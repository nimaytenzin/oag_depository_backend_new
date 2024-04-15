import { USERROLES } from './../../../constants/enums';
export class CreateUserDto {
  fullName: string;
  role: USERROLES;
  email: string;
  password: string;
}
