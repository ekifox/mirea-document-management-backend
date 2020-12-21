import * as ExpressSession from 'express-session'
import * as FileStoreBase from 'session-file-store'
import {
    initializeTransactionalContext,
    patchTypeORMRepositoryWithBaseRepository
} from 'typeorm-transactional-cls-hooked'

import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { UserEntity } from './user/user.entity'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

const FileStore = FileStoreBase(ExpressSession)

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.use(
        ExpressSession({
            secret: 'mirea',
            resave: true,
            saveUninitialized: false,
            store: new FileStore({
                path: './sessions'
            }),
            cookie: {
                path: '/',
                httpOnly: false,
                secure: false,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: false
            }
        })
    )
    app.enableCors({
        credentials: true,
        origin: true
    })

    const options = new DocumentBuilder()
        .setTitle('DocumentManagement')
        .setDescription('The API description')
        .setVersion('1.0')
        .build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('docs', app, document)

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
