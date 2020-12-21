import { Injectable, NestMiddleware } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { NextFunction, Request, Response } from 'express'
import { Repository } from 'typeorm'
import { UserEntity } from '../user/user.entity'

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    async use(request: Request, response: Response, next: NextFunction) {
        if (request.session && request.session.userId) {
            try {
                request.user = await this.userRepository.findOneOrFail(request.session.userId)
            } catch (e) {
                console.log(e)
            }
        }

        return next()
    }
}
