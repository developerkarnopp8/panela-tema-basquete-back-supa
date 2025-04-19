import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateInviteDto } from './dto/create-invite.dto';
import { InvitesService } from './invites.service'
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
  } from '@nestjs/swagger';

@ApiTags('Invites')
@ApiBearerAuth()
@Controller('invites')
export class InvitesController {
    constructor(private readonly InvitesService: InvitesService) {}
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('LEADER')
    @Post('/invites')
    @ApiOperation({ summary: 'Líder gera o invite para o usuário player' })
    @ApiResponse({ status: 200, description: 'Gerou o invite com sucesso' })
    createInvite(@Body() dto: CreateInviteDto, @Req() req: any) {
    return this.InvitesService.createInvite(dto, req.user.userId);
    }

    @Get('/invites/:code')
    @ApiOperation({ summary: 'Pega o invite do usuário na tela de cadastro do playes' })
    @ApiResponse({ status: 200, description: 'Pegou o invite com sucesso' })
    findInvite(@Param('code') code: string) {
    return this.InvitesService.findInviteByCode(code);
    }

}
