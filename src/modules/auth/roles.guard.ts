import { ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    } else {
      const request = context.switchToHttp().getRequest();
      const authorizationHeader = <string>request.headers.authorization;
      if (authorizationHeader) {
        const jwtToken = authorizationHeader.replace('Bearer ', '');
        const user = await this.authService.validateUserwithToken(jwtToken);
        console.log('\n');
        console.log('Role Guard Check');
        console.log(`https://baseurl${request.url}`);
        console.log('REQUIRED ROLES', requiredRoles);
        console.log('USER ROLE', user.role);
        console.log(
          'IS USER AUTHORIZED? === ',
          requiredRoles.some((role) => user.role === role),
        );
        console.log('\n');
        return requiredRoles.some((role) => role === user.role);
      }
    }
  }
}
