import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const prisma = new PrismaService();

export const CompanyInfoSchema = z
    .object({
        cnpj: z.string().length(14, 'O CNPJ deve ter 14 caracteres'),
        cpf: z.string().length(11, 'O CPF deve ter 11 caracteres'),
        companyName: z
            .string()
            .min(3, 'A razão social deve ter no mínimo 3 caracteres'),
        fantasyName: z
            .string()
            .min(3, 'O nome fantasia deve ter no mínimo 3 caracteres'),
    })
    .required()
    .refine(
        async (data) => {
            const company = await prisma.company.findUnique({
                where: { cnpj: data.cnpj },
            });
            if (company) {
                return false;
            }
            return true;
        },
        {
            message: 'Este CNPJ já está sendo utilizado',
            path: ['cnpj'],
        },
    )
    .refine(
        async (data) => {
            const company = await fetch(
                `https://publica.cnpj.ws/cnpj/${data.cnpj}`,
            );

            return company.status === 200;
        },
        {
            message: 'Não existe nenhuma empresa cadastrada neste CNPJ',
            path: ['cnpj'],
        },
    )
    .refine(
        (data) => {
            const cpf = data.cpf;
            if (
                [
                    '00000000000',
                    '11111111111',
                    '22222222222',
                    '33333333333',
                    '44444444444',
                    '55555555555',
                    '66666666666',
                    '77777777777',
                    '88888888888',
                    '99999999999',
                ].includes(cpf)
            )
                return false;

            if (cpf.length != 11) return false;

            let soma = 0;
            let resto;

            for (let i = 1; i <= 9; i++) {
                soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
            }

            resto = (soma * 10) % 11;
            if (resto == 10 || resto == 11) resto = 0;

            if (resto != parseInt(cpf.substring(9, 10))) return false;

            soma = 0;
            for (let i = 1; i <= 10; i++) {
                soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
            }

            resto = (soma * 10) % 11;
            if (resto == 10 || resto == 11) resto = 0;

            if (resto != parseInt(cpf.substring(10, 11))) return false;

            return true;
        },
        {
            message: 'Insira um CPF válido',
            path: ['cpf'],
        },
    );

export type CompanyInfoDto = z.infer<typeof CompanyInfoSchema>;
