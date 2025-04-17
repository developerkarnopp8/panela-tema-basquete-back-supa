import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateInviteDto } from './dto/create-invite.dto';
import { InvitesService } from './invites.service'

@Controller('invites')
export class InvitesController {
    constructor(private readonly InvitesService: InvitesService) {}
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('LEADER')
    @Post('/invites')
    createInvite(@Body() dto: CreateInviteDto, @Req() req: any) {
    return this.InvitesService.createInvite(dto, req.user.userId);
    }

    @Get('/invites/:code')
    findInvite(@Param('code') code: string) {
    return this.InvitesService.findInviteByCode(code);
    }

}
