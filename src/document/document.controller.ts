import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    Param,
    Post,
    Put,
    Query,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import {
    ApiBody,
    ApiConsumes,
    ApiCookieAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags
} from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthenticationGuard } from '../authentication/authentication.guard'
import { User } from '../user/user.decorator'
import { UserEntity } from '../user/user.entity'
import { DocumentEntity } from './document.entity'
import { DocumentRepository } from './document.repository'
import { DocumentService } from './document.service'
import { DocumentCreateInput } from './input/create.input'
import { DocumentUploadInput } from './input/upload.input'
import { DocumentSearchItemResponse } from './response/search.response'

@Controller('document')
@ApiCookieAuth()
@ApiTags('document')
@UsePipes(new ValidationPipe())
@UseGuards(AuthenticationGuard)
export class DocumentController {
    @Inject()
    private readonly service: DocumentService

    @InjectRepository(DocumentRepository)
    private readonly documentRepository: DocumentRepository

    @Get('mylist')
    @ApiOperation({ summary: 'Получить данные о документе' })
    @ApiOkResponse({ type: DocumentEntity })
    @UseInterceptors(ClassSerializerInterceptor)
    async getUserList(@User() user: UserEntity) {
        return await this.documentRepository.find({
            where: { user }
        })
    }

    @Get(':uuid')
    @ApiOperation({ summary: 'Получить данные о документе' })
    @ApiOkResponse({ type: DocumentEntity })
    @UseInterceptors(ClassSerializerInterceptor)
    async get(@Param('uuid') uuid: string) {
        return await this.documentRepository.findOneOrFail({
            where: { id: uuid },
            relations: ['user', 'auditors', 'auditors.user']
        })
    }

    @Put()
    @ApiOperation({ summary: 'Добавить новый документ в систему' })
    @ApiBody({ type: DocumentCreateInput })
    @ApiCreatedResponse({ type: DocumentEntity })
    async create(@User() user: UserEntity, @Body() input: DocumentCreateInput) {
        return await this.service.create(user, input.title, input.auditorUserIds)
    }

    @Post('link')
    @ApiOperation({ summary: 'Сгенерировать URL для просмотра документа' })
    async link(@User() user: UserEntity, @Body('uuid') uuid: string) {
        return await this.service.link(user, uuid)
    }

    @Put('upload')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'document', maxCount: 1 }]))
    @ApiOperation({ summary: 'Загрузить документ в систему' })
    @ApiConsumes('multipart/form-data')
    @ApiQuery({ name: 'uuid', type: 'string' })
    @ApiBody({ description: 'Файл документа', type: DocumentUploadInput })
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

    @Post('publish')
    @ApiOperation({ summary: 'Опубликовать документ в поиске' })
    async publish(@User() user: UserEntity, @Body('uuid') uuid: string) {
        await this.service.publish(user, uuid)
        return true
    }

    @Post('search')
    @ApiOperation({ summary: 'Поиск опубликованного файла по тексту' })
    @ApiCreatedResponse({ type: [DocumentSearchItemResponse] })
    async search(@Body('text') text: string) {
        return await this.service.search(text)
    }
}
