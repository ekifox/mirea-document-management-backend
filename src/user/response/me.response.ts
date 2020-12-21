import { OmitType } from '@nestjs/swagger'
import { UserEntity } from '../user.entity'

export class UserMeResponse extends OmitType(UserEntity, ['passwordHash', 'updatedAt']) {}
