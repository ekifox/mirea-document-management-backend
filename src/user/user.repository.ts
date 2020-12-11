import { EntityRepository } from 'typeorm'
import { UserEntity } from './user.entity'
import { BaseRepository } from 'typeorm-transactional-cls-hooked'

@EntityRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> {}
