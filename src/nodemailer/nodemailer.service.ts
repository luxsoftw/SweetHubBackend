import { Injectable, InternalServerErrorException } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { SendMailParams } from './interfaces/nodemailer.interface';

@Injectable()
export class NodemailerService {
    private transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    sendMail({
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
                    throw new InternalServerErrorException(
                        'Erro ao enviar o email. Tente novamente mais tarde!',
                    );
                }
            },
        );
    }
}
