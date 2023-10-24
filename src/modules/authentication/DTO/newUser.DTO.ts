import { ApiProperty } from '@nestjs/swagger';

export class NewUserDTO {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  email: string;
  phoneNumber: string;
  role: string;
}
export class LogIn {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}
