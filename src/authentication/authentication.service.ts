import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as crypto from 'crypto'
import { Transactional } from 'typeorm-transactional-cls-hooked'
import { promisify } from 'util'
import { UserRepository } from '../user/user.repository'

const pbkdf2Async = promisify(crypto.pbkdf2)

@Injectable()
export class AuthenticationService {
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository

    @Transactional()
    async register(login: string, password: string, passwordConfirmation: string) {
        if (password !== passwordConfirmation) {
            throw new HttpException('Password confirmation mismatch', HttpStatus.FORBIDDEN)
        }

        const isAlreadyRegistered = await this.userRepository.findOne({
            select: ['id'],
            where: {
                login
            }
        })

        if (isAlreadyRegistered && isAlreadyRegistered.id) {
            throw new HttpException('User with the same login already exists', HttpStatus.CONFLICT)
        }

        const passwordHash = await this.passwordHash(password)

        const user = await this.userRepository.save({
            login,
            passwordHash
        })

        return user
    }

    async verify(login: string, password: string) {
        const passwordHash = await this.passwordHash(password)

        const user = await this.userRepository.findOne({
            where: {
                login,
                passwordHash
            }
        })

        if (!user) {
            throw new HttpException('User with the provided login is not registered', HttpStatus.NOT_FOUND)
        }

        return user
    }

    private async passwordHash(password: string) {
        const derivedKey = await pbkdf2Async(password, 'mirea', 10, 64, 'sha512')
        return derivedKey.toString('hex')
    }
}
