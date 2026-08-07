import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Applies the 'jwt' strategy registered above to any route it decorates
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
