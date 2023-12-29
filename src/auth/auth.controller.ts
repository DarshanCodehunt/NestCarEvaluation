import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { createUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { UpdateuserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserResponseDto } from './dtos/user-response.dto';
import { UserAuthenticationService } from './userauthentication.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Auth } from './auth.entity';
import { AuthGuard } from './guards/auth.guard';

@Serialize(UserResponseDto)
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userAuth: UserAuthenticationService,
  ) {}
  @Post('/signup')
  async signup(@Body() body: createUserDto, @Session() session: any) {
    const user = await this.userAuth.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: createUserDto, @Session() session: any) {
    const user = await this.userAuth.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  // @Get('whoami')
  // whoamI(@Session() session: any) {
  //   return this.authService.findUser(session.userId);
  // }

  @UseGuards(AuthGuard)
  @Get('whoami')
  whoamI(@CurrentUser() user: Auth) {
    return user;
  }

  @Post('/create-user')
  createUser(@Body() body: createUserDto) {
    return this.authService.createUser(body.email, body.password);
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.authService.findUser(Number(id));
  }

  @Get('/')
  findByEmail(@Query('email') email: string) {
    return this.authService.findAll(email);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.authService.remove(Number(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateuserDto) {
    return this.authService.update(Number(id), body);
  }

  @Get('/testcookie/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
  }

  @Get('/testcookie/colors')
  getColor(@Session() session: any) {
    return session.color;
  }
}
