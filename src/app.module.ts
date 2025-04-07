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
import { EventModule } from './event/event.module';
import { CheckinModule } from './checkin/checkin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 🔥 Torna o módulo de config disponível em todo o app
    }),
    UsersModule,
    PrismaModule,
    AuthModule,
    EventModule,
    CheckinModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
