import { Body, Controller, Inject, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiBody, ApiCookieAuth, ApiOperation } from '@nestjs/swagger'
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
    @ApiOperation({ summary: 'Принять или отклонить согласование документа' })
    @ApiBody({ type: DocumentCreateInput })
    async create(@User() user: UserEntity, @Body() input: DocumentCreateInput, @UploadedFiles() files) {
        console.log(input)
        console.log(files)
        return true
    }
}
