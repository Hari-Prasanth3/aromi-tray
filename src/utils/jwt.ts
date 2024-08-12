import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

export function generateAccessToken(userId: string, phoneNumber: string, email: string, configService: ConfigService): string {
  return jwt.sign(
    { userId, phoneNumber, email }, 
    configService.get<string>('JWT_SECRET'), 
    { expiresIn: '1d' }
  );
}

export function generateRefreshToken(userId: string, phoneNumber: string, email: string, configService: ConfigService): string {
  return jwt.sign(
    { userId, phoneNumber, email }, 
    configService.get<string>('REFRESH_TOKEN_SECRET'), 
    { expiresIn: '7d' }
  );
}

export function verifyRefreshToken(token: string, configService: ConfigService): any {
  try {
    return jwt.verify(token, configService.get<string>('REFRESH_TOKEN_SECRET'));
  } catch (error) {
    throw new UnauthorizedException('Invalid refresh token');
  }
}

