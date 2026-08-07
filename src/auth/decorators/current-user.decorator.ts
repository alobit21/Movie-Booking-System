import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserPayload {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

// Usage: create(@CurrentUser() user: CurrentUserPayload) — only valid on
// routes guarded by JwtAuthGuard, since that's what populates request.user
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
