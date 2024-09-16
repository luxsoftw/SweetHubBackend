import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { SocketModule } from './socket/socket.module';
import { AuthModule } from './auth/auth.module';
import { HelpersModule } from './helpers/helpers.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { VerifyAuthMiddleware } from './verify-auth/verify-auth.middleware';
import { NodemailerModule } from './nodemailer/nodemailer.module';
import { ValidatorsModule } from './validators/validators.module';

@Module({
    imports: [
        UsersModule,
        PrismaModule,
        SocketModule,
        AuthModule,
        HelpersModule,
        DashboardModule,
        NodemailerModule,
        ValidatorsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(VerifyAuthMiddleware).forRoutes('dashboard');
    }
}
