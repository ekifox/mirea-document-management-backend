import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiCookieAuth, ApiOperation } from '@nestjs/swagger'
import { AuthenticationGuard } from '../authentication/authentication.guard'
import { User } from '../user/user.decorator'
import { UserEntity } from '../user/user.entity'
import { DocumentAuditorService } from './auditor.service'
import { DocumentAuditorAuditInput } from './input/audit.input'

@Controller('document/auditor')
export class DocumentAuditorController {
    @Inject()
    private readonly service: DocumentAuditorService

    @Post()
    @UseGuards(AuthenticationGuard)
    @ApiCookieAuth()
    @ApiOperation({ summary: 'Принять или отклонить согласование документа' })
    @ApiBody({ type: DocumentAuditorAuditInput })
    async audit(@User() user: UserEntity, @Body() input: DocumentAuditorAuditInput) {
        await this.service.audit(user, input.documentId, input.isAgreed)
        return true
    }
}
