import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Inject,
    Post,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'
import { ApiBody, ApiCookieAuth, ApiOperation } from '@nestjs/swagger'
import { AuthenticationGuard } from '../authentication/authentication.guard'
import { User } from '../user/user.decorator'
import { UserEntity } from '../user/user.entity'
import { DocumentAuditorService } from './auditor.service'
import { DocumentAuditorAuditInput } from './input/audit.input'

@Controller('document/auditor')
@UsePipes(new ValidationPipe())
@UseGuards(AuthenticationGuard)
@ApiCookieAuth()
export class DocumentAuditorController {
    @Inject()
    private readonly service: DocumentAuditorService

    @Post()
    @ApiOperation({ summary: 'Принять или отклонить согласование документа' })
    @ApiBody({ type: DocumentAuditorAuditInput })
    async audit(@User() user: UserEntity, @Body() input: DocumentAuditorAuditInput) {
        await this.service.audit(user, input.documentId, input.isAgreed)
        return true
    }

    @Get('list')
    @ApiOperation({ summary: 'Получить список документов для аудита' })
    @UseInterceptors(ClassSerializerInterceptor)
    async list(@User() user: UserEntity) {
        return await this.service.list(user)
    }
}
