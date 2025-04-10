/* eslint-disable prettier/prettier */
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ✅ Importa o módulo de config
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

// MODULOS DO APP
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { PlayerTeamModule } from './player-team/player-team.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 🔥 Torna o módulo de config disponível em todo o app
    }),
    UsersModule,
    PrismaModule,
    AuthModule,
    TeamsModule,
    PlayerTeamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
