import { Module } from '@nestjs/common';
import { SignUpController } from './sign-up.controller';
import { SignUpService } from './sign-up.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { HelpersModule } from 'src/helpers/helpers.module';

@Module({
    controllers: [SignUpController],
    providers: [SignUpService],
    imports: [PrismaModule, UsersModule, HelpersModule],
})
export class SignUpModule {}
