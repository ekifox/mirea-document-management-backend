import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const User = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    if (request) {
        const user = request.user as any

        if (user && user.id) {
            return user
        }
    } else {
        throw new Error('wtf where is request')
    }
})
