import { Body, Controller, Get } from '@nestjs/common';
import { Company } from '@prisma/client';

@Controller('dashboard')
export class DashboardController {
    @Get()
    async getDashboard(@Body('company') company: Omit<Company, 'password'>) {
        return `Dashboard da Empresa ${company.fantasyName}`;
    }
}
