import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
@Injectable()
export class UserAuthenticationService {
  constructor(private authService: AuthService) {}

  async signup(email: string, password: string) {
    const checkUser = await this.authService.findAll(email);
    if (checkUser.length) {
      throw new BadRequestException('User email already in use');
    }
    const salt = randomBytes(8).toString('hex');
    const hashedValue = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hashedValue.toString('hex');
    const user = await this.authService.createUser(email, result);

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.authService.findAll(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }
    const [salt, storedPassword] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedPassword !== hash.toString('hex')) {
      throw new BadRequestException('wrong password');
    }

    return user;
  }
}
