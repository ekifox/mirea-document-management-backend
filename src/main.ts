import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
    initializeTransactionalContext,
    patchTypeORMRepositoryWithBaseRepository
} from 'typeorm-transactional-cls-hooked'
import { AppModule } from './app.module'
import * as ExpressSession from 'express-session'
import { UserEntity } from './user/user.entity'
import * as FileStoreBase from 'session-file-store'

const FileStore = FileStoreBase(ExpressSession)

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.useGlobalPipes(new ValidationPipe())
    app.use(
        ExpressSession({
            secret: 'mirea',
            resave: true,
            saveUninitialized: false,
            store: new FileStore({
                path: './sessions'
            })
        })
    )

    await app.listen(3000)
}

initializeTransactionalContext()
patchTypeORMRepositoryWithBaseRepository()
bootstrap()

declare module 'express-serve-static-core' {
    export interface Request {
        user: UserEntity
        session: {
            userId: number
            save: () => {}
        }
    }
}
