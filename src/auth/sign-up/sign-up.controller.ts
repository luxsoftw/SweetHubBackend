import {
    Body,
    ConflictException,
    Controller,
    Post,
    UsePipes,
} from '@nestjs/common';
import {
    UserInfoDto,
    userInfoSchema,
} from 'src/validators/schemas/auth/UserInfo.schema';
import { ValidatorsPipe } from 'src/validators/validators.pipe';
import { SignUpData, SignUpSuccessfull } from '../interfaces/Auth.interface';
import { SignUpService } from './sign-up.service';
import {
    CompanyInfoDto,
    CompanyInfoSchema,
} from 'src/validators/schemas/auth/CompanyInfo.schema';
import {
    AddressInfoDto,
    addressInfoSchema,
} from 'src/validators/schemas/auth/AddressInfo.schema';
import { signUpSchema } from 'src/validators/schemas/auth/SignUp.schema';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('auth/sign-up')
export class SignUpController {
    constructor(
        private signUpService: SignUpService,
        private prismaService: PrismaService,
    ) {}

    @Post()
    @UsePipes(new ValidatorsPipe(signUpSchema))
    signUp(@Body() signUpData: SignUpData): Promise<SignUpSuccessfull | void> {
        return this.signUpService.signUp(signUpData);
    }

    @Post('validate/user-info')
    @UsePipes(new ValidatorsPipe(userInfoSchema))
    async userInfo(@Body() userInfo: UserInfoDto) {
        const { email } = userInfo;
        const userWithSameEmail = await this.prismaService.company.findUnique({
            where: { email },
        });

        if (userWithSameEmail) {
            return false;
        }

        return true;
    }

    @Post('validate/company-info')
    @UsePipes(new ValidatorsPipe(CompanyInfoSchema))
    async companyInfo(@Body() companyInfo: CompanyInfoDto) {
        const { cnpj } = companyInfo;

        const companyWithSameCnpj = await this.prismaService.company.findUnique(
            { where: { cnpj } },
        );

        if (companyWithSameCnpj) {
            throw new ConflictException(
                'Company with same cnpj address already exist.',
            );
        }
    }

    @Post('validate/address-info')
    @UsePipes(new ValidatorsPipe(addressInfoSchema))
    address(@Body() addressInfo: AddressInfoDto) {
        return addressInfo;
    }
}
