import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
    if (issue.code === 'invalid_type') {
        return { message: 'Campo obrigatório' };
    }

    return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);

const prisma = new PrismaService();

export const userInfoSchema = z
    .object({
        name: z
            .string()
            .min(3, 'O nome deve ter no mínimo 3 caracteres')
            .max(255, 'O nome deve ter no máximo 255 caracteres'),
        email: z.string().email('Insira um email válido'),
        phone: z.string().length(11, 'Insira um telefone válido'),
        password: z
            .string()
            .min(8, 'A senha deve ter no mínimo 8 caracteres')
            .max(16, 'A senha deve ter no máximo 16 caracteres'),
        confirmPassword: z.string(),
    })
    .required()
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Senhas não conferem',
        path: ['confirmPassword'],
    })
    .refine(
        async (data) => {
            const company = await prisma.user.findUnique({
                where: { email: data.email },
            });
            if (company) {
                return false;
            }
            return true;
        },
        {
            message: 'Este email já está em uso',
            path: ['email'],
        },
    );

export type UserInfoDto = z.infer<typeof userInfoSchema>;
