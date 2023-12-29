import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class CurrentUserinterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    if (userId) {
      const user = await this.authService.findUser(userId);
      request.CurrentUser = user;
    }

    return next.handle();
  }
}
