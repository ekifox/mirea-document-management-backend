import { Request } from 'express'

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class AuthenticationGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>()

        if (!request || !request.user || !request.user.id) {
            return false
        }

        return true
    }
}
