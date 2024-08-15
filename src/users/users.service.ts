import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

interface UserToCreate extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
    confirmPassword: string;
}

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) {}

    async findById(id: string): Promise<Omit<User, 'password'> | null> {
        const user = await this.prismaService.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                fantasyName: true,
                email: true,
                cpf: true,
                cnpj: true,
                addressNumber: true,
                companyName: true,
                createdAt: true,
                streetName: true,
                updatedAt: true,
                zipCode: true,
            },
        });

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });

        return user;
    }

    async create(data: UserToCreate): Promise<User> {
        const user = await this.prismaService.user.create({
            data: {
                email: data.email,
                password: data.password,
                fantasyName: data.fantasyName,
                cpf: data.cpf,
                cnpj: data.cnpj,
                addressNumber: data.addressNumber,
                companyName: data.companyName,
                zipCode: data.zipCode,
            },
        });

        return user;
    }
}
