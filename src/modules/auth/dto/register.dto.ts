import { USERROLES } from './../../../constants/enums';
export class UserSignUpDto {
  fullName: string;
  role: USERROLES;
  email: string;
  password: string;
}
