import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Inject,
    Put,
    Query,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiCookieAuth, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { AuthenticationGuard } from '../authentication/authentication.guard'
import { User } from '../user/user.decorator'
import { UserEntity } from '../user/user.entity'
import { DocumentService } from './document.service'
import { DocumentCreateInput } from './input/create.input'

@Controller('document')
export class DocumentController {
    @Inject()
    private readonly service: DocumentService

    @Put()
    @UseGuards(AuthenticationGuard)
    @UseInterceptors(FileFieldsInterceptor([{ name: 'document', maxCount: 1 }]))
    @ApiCookieAuth()
    @ApiOperation({ summary: 'Добавить новый документ в систему' })
    @ApiBody({ type: DocumentCreateInput })
    async create(@User() user: UserEntity, @Body() input: DocumentCreateInput) {
        return await this.service.create(user, input.title, input.auditorUserIds)
    }

    @Put('upload')
    @UseGuards(AuthenticationGuard)
    @UseInterceptors(FileFieldsInterceptor([{ name: 'document', maxCount: 1 }]))
    @ApiCookieAuth()
    @ApiOperation({ summary: 'Загрузить документ в систему' })
    @ApiQuery({ name: 'uuid', type: 'string' })
    async upload(@User() user: UserEntity, @Query('uuid') uuid: string, @UploadedFiles() uploadedFiles) {
        if (!uuid) {
            throw new HttpException('Bad UUID', HttpStatus.BAD_REQUEST)
        }

        if (!uploadedFiles || !uploadedFiles.document || !uploadedFiles.document.length) {
            throw new HttpException('File is not uploaded or uploaded without document field', HttpStatus.BAD_REQUEST)
        }

        if (uploadedFiles.document.length !== 1) {
            throw new HttpException('You cant upload multiple files', HttpStatus.BAD_REQUEST)
        }

        const file = uploadedFiles.document[0]

        if (!file.buffer || !file.mimetype || !file.size) {
            throw new HttpException('Bad file received', HttpStatus.BAD_REQUEST)
        }

        if (file.mimetype !== 'application/pdf') {
            throw new HttpException('You cant upload a file other than pdf format', HttpStatus.BAD_REQUEST)
        }

        await this.service.upload(user, uuid, file.buffer)

        return true
    }

    /*
     * надо запилить upload file link после create, чтобы передавать напрямую в elastic
     * только надо проверить pdf это или нет
     * S3-like фейкануть бы еще
     */
}
