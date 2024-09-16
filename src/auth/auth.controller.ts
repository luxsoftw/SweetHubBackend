import {
    Controller,
    Post,
    Body,
    BadRequestException,
    Headers,
    Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInData, SignInSuccessfull } from './interfaces/Auth.interface';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('sign-in')
    signIn(@Body() signInData: SignInData): Promise<SignInSuccessfull | void> {
        if (!signInData.email)
            throw new BadRequestException('Email is required');
        if (!signInData.password)
            throw new BadRequestException('Password is required');
        return this.authService.signIn(signInData);
    }

    @Get('email-validate')
    async getValidationEmail(
        @Headers('authorization') authorization: string,
    ): Promise<{ message: string } | void> {
        return await this.authService.getValidationEmail(authorization);
    }

    @Post('email-validate')
    async validateEmail(
        @Body('token') token: string,
    ): Promise<{ message: string } | void> {
        return await this.authService.validateEmail(token);
    }
}
