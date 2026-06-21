import { Injectable, CanActivate, ExecutionContext, SetMetadata, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { UserRole } from "@roohbakhsh/shared";
import type { User } from "../../modules/auth/entities/user.entity";

export const ROLES_KEY = "roles";
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;
    const user = context.switchToHttp().getRequest<{ user: User }>().user;
    if (!required.includes(user?.role)) throw new ForbiddenException("FORBIDDEN");
    return true;
  }
}
