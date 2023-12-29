import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth } from './auth.entity';
import { UserAuthenticationService } from './userauthentication.service';

describe('AuthController', () => {
  let fakeAuthService: Partial<AuthService>;
  let fakeuserAuthenticationService: Partial<UserAuthenticationService>;
  let controller: AuthController;
  beforeEach(async () => {
    fakeAuthService = {
      createUser: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as Auth),
      findUser: (id: number) =>
        Promise.resolve({ id, email: 'test', password: 'test' } as Auth),
      findAll: (email: string) =>
        Promise.resolve([{ id: 1, email, password: 'test' } as Auth]),
    };

    fakeuserAuthenticationService = {
      signup: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as Auth),
      signin: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as Auth),
    };
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        {
          provide: UserAuthenticationService,
          useValue: fakeuserAuthenticationService,
        },
      ],
    }).compile();

    controller = module.get(AuthController);
  });

  it('should create a controller', () => {
    expect(controller).toBeDefined();
  });

  it('should correctly find user by id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('should return the signed up user and update the session when user signs up', async () => {
    const session: any = {};
    const user = await controller.signup(
      { email: 'd', password: 'd' },
      session,
    );
    expect(user).toBeDefined();
    expect(session.userId).toEqual(1);
  });
});
