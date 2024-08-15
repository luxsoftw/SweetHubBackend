import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
    SignInData,
    SignInSuccessfull,
    SignUpData,
    SignUpSuccessfull,
} from './interfaces/Auth.interface';

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

    @Post('sign-up')
    signUp(@Body() signUpData: SignUpData): Promise<SignUpSuccessfull | void> {
        return this.authService.signUp(signUpData);
    }
}
