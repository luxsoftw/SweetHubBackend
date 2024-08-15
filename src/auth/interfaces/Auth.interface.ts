import { User } from '@prisma/client';

export interface SignInSuccessfull {
    token: string;
}

export interface SignInData {
    email: string;
    password: string;
}

export interface SignUpData
    extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
    confirmPassword: string;
}

export interface SignUpSuccessfull {
    message: string;
}
