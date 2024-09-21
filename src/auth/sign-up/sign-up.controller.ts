import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { userInfoSchema } from 'src/validators/schemas/auth/UserInfo.schema';
import { ValidatorsPipe } from 'src/validators/validators.pipe';
import { SignUpData, SignUpSuccessfull } from '../interfaces/Auth.interface';
import { SignUpService } from './sign-up.service';
import { CompanyInfoSchema } from 'src/validators/schemas/auth/CompanyInfo.schema';
import { addressInfoSchema } from 'src/validators/schemas/auth/AddressInfo.schema';
import { signUpSchema } from 'src/validators/schemas/auth/SignUp.schema';

@Controller('auth/sign-up')
export class SignUpController {
    constructor(private signUpService: SignUpService) {}

    @Post()
    @UsePipes(new ValidatorsPipe(signUpSchema))
    signUp(@Body() signUpData: SignUpData): Promise<SignUpSuccessfull | void> {
        return this.signUpService.signUp(signUpData);
    }

    @Get('validate/user-info')
    @UsePipes(new ValidatorsPipe(userInfoSchema))
    userInfo() {}

    @Get('validate/company-info')
    @UsePipes(new ValidatorsPipe(CompanyInfoSchema))
    companyInfo() {}

    @Get('validate/address-info')
    @UsePipes(new ValidatorsPipe(addressInfoSchema))
    address() {}
}
