import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Auth } from './auth.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(Auth) private authRepo: Repository<Auth>) {}
  createUser(email: string, password: string) {
    const user = this.authRepo.create({ email, password });
    return this.authRepo.save(user);
  }

  async findUser(id: number) {
    if (!id) {
      return null;
    }
    return await this.authRepo.findOneBy({ id });
  }

  findAll(email: string) {
    return this.authRepo.find({ where: { email } });
  }

  async update(id: number, user: Partial<Auth>) {
    const userId = await this.findUser(id);

    if (!userId) {
      throw new NotFoundException('User not found');
    }

    Object.assign(userId, user);
    return this.authRepo.save(userId);
  }

  async remove(id: number) {
    const user = await this.findUser(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.authRepo.remove(user);
  }
}
