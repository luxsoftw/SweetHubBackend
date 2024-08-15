import { Body, Controller, Get } from '@nestjs/common';
import { User } from '@prisma/client';

@Controller('dashboard')
export class DashboardController {
    @Get()
    async getDashboard(@Body('user') user: Omit<User, 'password'>) {
        console.log({ user });
        return `Dashboard da Empresa ${user.fantasyName}`;
    }
}
