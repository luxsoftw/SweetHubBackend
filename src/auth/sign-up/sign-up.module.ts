import { Module } from '@nestjs/common';
import { SignUpController } from './sign-up.controller';
import { SignUpService } from './sign-up.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CompaniesModule } from 'src/companies/companies.module';

@Module({
    controllers: [SignUpController],
    providers: [SignUpService],
    imports: [PrismaModule, CompaniesModule],
})
export class SignUpModule {}
