import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth.service';
import { Auth } from '../auth.entity';

declare global {
  namespace Express {
    interface Request {
      CurrentUser?: Auth;
    }
  }
}

@Injectable()
export class CurrentUsermiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};
    if (userId) {
      const user = await this.authService.findUser(userId);
      req.CurrentUser = user;
    }

    next();
  }
}
