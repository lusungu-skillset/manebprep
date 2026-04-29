import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

const DEFAULT_ADMIN_KEY = 'maneb-admin';

@Injectable()
export class AdminKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const providedKey = this.getHeaderValue(request.headers['x-admin-key']);
    const expectedKey = process.env.ADMIN_API_KEY?.trim() || DEFAULT_ADMIN_KEY;

    if (!providedKey || providedKey !== expectedKey) {
      throw new UnauthorizedException('Invalid admin key.');
    }

    return true;
  }

  private getHeaderValue(value: string | string[] | undefined): string | null {
    if (!value) {
      return null;
    }

    if (Array.isArray(value)) {
      return value[0]?.trim() || null;
    }

    return value.trim() || null;
  }
}
