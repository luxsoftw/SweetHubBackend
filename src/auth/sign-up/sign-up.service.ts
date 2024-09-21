import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignUpSuccessfull, SignUpData } from '../interfaces/Auth.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SignUpService {
    constructor(private usersService: UsersService) {}

    async signUp(SignUpData: SignUpData): Promise<SignUpSuccessfull | void> {
        const hashedPassword = await bcrypt.hash(SignUpData.password, 10);

        return await this.usersService.create({
            ...SignUpData,
            password: hashedPassword,
        });
    }
}
