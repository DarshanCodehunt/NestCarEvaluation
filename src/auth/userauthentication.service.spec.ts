import { Test } from '@nestjs/testing';
import { UserAuthenticationService } from './userauthentication.service';
import { AuthService } from './auth.service';
import { Auth } from './auth.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UserAuthenticationService', () => {
  let service: UserAuthenticationService;
  let fakeAuthService: Partial<AuthService>;
  beforeEach(async () => {
    //UserAuthenticationService is dependent upon the auth service
    fakeAuthService = {
      findAll: (email: string) => Promise.resolve([]),
      createUser: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as Auth),
    };
    const module = await Test.createTestingModule({
      providers: [
        UserAuthenticationService,
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    service = module.get(UserAuthenticationService);
  });

  it('should create an instance of user authentication service', async () => {
    expect(service).toBeDefined();
  });

  it('should create user with salted and hashed password', async () => {
    const user = await service.signup('darshan.kodkani@scogen.com', 'test@123');
    expect(user.password).not.toEqual('test@123');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should throw an error if the user signs up with already used email', async () => {
    fakeAuthService.findAll = () =>
      Promise.resolve([{ id: 1, email: 'a', password: 'b' } as Auth]);
    await expect(
      service.signup('darshan.kodkani@scogen.com', 'test@123'),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw an error if the user signs in with email that is not found', async () => {
    await expect(
      service.signin('darshan.kodkani@scogen.com', 'test@123'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw an error if an invalid password is provided', async () => {
    fakeAuthService.findAll = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'darshan.kodkani@scogen.com',
          password: '123456.3456789',
        } as Auth,
      ]);
    await expect(
      service.signin('darshan.kodkani@scogen.com', 'test@123'),
    ).rejects.toThrow(BadRequestException);
  });

  it('should sign in user successfully', async () => {
    fakeAuthService.findAll = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'darshan.kodkani@scogen.com',
          password:
            'adcf104516d6b021.243bd9239028ac273105b6f36f622522cd828c10b2a717da414c6c9389de1a27',
        } as Auth,
      ]);

    const user = await service.signin('darshan.kodkani@scogen.com', 'test@123');
    expect(user).toBeDefined();
  });
});
