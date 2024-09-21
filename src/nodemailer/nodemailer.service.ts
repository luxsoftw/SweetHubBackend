import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailParams } from './interfaces/nodemailer.interface';
import * as path from 'node:path';
import * as fs from 'node:fs';

@Injectable()
export class NodemailerService {
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    private sendMail({
        destiny,
        subject,
        html,
    }: SendMailParams): InternalServerErrorException | void {
        this.transporter.sendMail(
            {
                from: process.env.MAIL_USER,
                to: destiny,
                subject,
                html,
            },
            (error) => {
                if (error) {
                    const date = new Date();
                    console.log(
                        `[${date.getDay()}/${date.getMonth()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]: ${error}`,
                    );
                    throw new InternalServerErrorException(
                        'Erro ao enviar o email. Tente novamente mais tarde!',
                    );
                }
            },
        );
    }

    async sendEmailValidation(
        destiny: string,
        token: string,
        name: string,
    ): Promise<void> {
        const variables = {
            name,
            link: `${process.env.FRONTEND_LINK}/verification/${token}`,
        };
        const html = fs
            .readFileSync(
                path.resolve(
                    __dirname,
                    '..',
                    '..',
                    'templates',
                    'email-validation.html',
                ),
                {
                    encoding: 'utf-8',
                },
            )
            .replace(/{{(\w+)}}/g, (_, key) => variables[key]);

        this.sendMail({
            destiny,
            subject: 'Validação de email | Sweet Hub',
            html,
        });
    }
}
