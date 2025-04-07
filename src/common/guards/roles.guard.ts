/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
// src/common/guards/roles.guard.ts
// import {
//     CanActivate,
//     ExecutionContext,
//     Injectable,
//   } from '@nestjs/common';
//   import { Reflector } from '@nestjs/core';
  
//   @Injectable()
//   export class RolesGuard implements CanActivate {
//     constructor(private reflector: Reflector) {}
  
//     canActivate(context: ExecutionContext): boolean {
//       const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
//       if (!requiredRoles) return true;
  
//       const { user } = context.switchToHttp().getRequest();
//       return requiredRoles.includes(user.role);
//     }
//   }


import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndMerge<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return requiredRoles.includes(user.role);
  }
}

  