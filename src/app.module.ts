import { MiddlewareConsumer, Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { TypeOrmModule } from '@nestjs/typeorm'
import { S3Module } from '@ntegral/nestjs-s3'

import { AdminModule } from './admin/admin.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthenticationMiddleware } from './authentication/authentication.middleware'
import { AuthenticationModule } from './authentication/authentication.module'
import { DepartmentModule } from './department/department.module'
import { DocumentModule } from './document/document.module'
import { UserModule } from './user/user.module'

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'postgres',
            database: 'postgres',
            entities: ['src/**/*.entity.ts'],
            synchronize: true
        }),
        MulterModule.register({
            dest: '/upload'
        }),
        S3Module.forRoot({
            accessKeyId: 'filestorage',
            secretAccessKey: 'filestorage'
        }),
        UserModule,
        AuthenticationModule,
        AdminModule,
        DepartmentModule,
        DocumentModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticationMiddleware).forRoutes('*')
    }
}
