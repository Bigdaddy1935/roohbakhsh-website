import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * مثل JwtAuthGuard ولی هیچ‌وقت 401 نمی‌دهد: اگر توکن معتبر باشد req.user پر می‌شود،
 * اگر نباشد یا نامعتبر باشد، req.user همان undefined می‌ماند (مسیر مهمان).
 * برای روت‌هایی که هم کاربر لاگین‌شده و هم مهمان باید بتوانند استفاده کنند (مثل ثبت تیکت).
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      await super.canActivate(context);
    } catch {
      // نادیده گرفته می‌شود — یعنی کاربر مهمان است
    }
    return true;
  }

  handleRequest<T>(_err: unknown, user: T | false): T | null {
    return user || null;
  }
}
