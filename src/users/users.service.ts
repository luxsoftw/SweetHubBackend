import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

interface UserToCreate {
    name: string;
    email: string;
    password: string;
}

@Injectable()
export class UsersService {
    constructor (private prismaService: PrismaService) {};

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        });

        return user;
    }

    async signIn(userData: UserToCreate): Promise<User | null> {
        const user = await this.prismaService.user.create({ data: userData });
        return user;
    }

}
