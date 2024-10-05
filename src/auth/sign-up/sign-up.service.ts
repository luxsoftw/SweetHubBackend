import { Injectable } from '@nestjs/common';
import { CompaniesService } from 'src/companies/companies.service';
import { SignUpSuccessfull, SignUpData } from '../interfaces/Auth.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SignUpService {
    constructor(private companiesService: CompaniesService) {}

    async signUp(SignUpData: SignUpData): Promise<SignUpSuccessfull | void> {
        const hashedPassword = await bcrypt.hash(SignUpData.password, 10);

        return await this.companiesService.create({
            ...SignUpData,
            password: hashedPassword,
        });
    }
}
