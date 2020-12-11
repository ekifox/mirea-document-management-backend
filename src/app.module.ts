import { MiddlewareConsumer, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

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
