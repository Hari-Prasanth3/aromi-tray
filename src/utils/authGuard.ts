import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearerHeader = request.headers.authorization;

    if (!bearerHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const accessToken = bearerHeader.split(' ')[1];
    if (!accessToken) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const decodedToken: any = jwt.verify(accessToken, this.configService.get<string>('JWT_SECRET'));
      const userId = decodedToken.userId; 
      
      const user = await this.userService.findById(userId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }
console.log();

      request.user = user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
