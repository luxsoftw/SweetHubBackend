import { z } from 'zod';

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
    if (issue.code === 'invalid_type') {
        return { message: 'Campo obrigatório' };
    }

    return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);

export const addressInfoSchema = z
    .object({
        cep: z.string().length(8, 'O CEP deve ter 8 caracteres'),
        state: z.string().min(2, 'O estado deve ter no mínimo 2 caracteres'),
        city: z.string().min(3, 'A rua deve ter no mínimo 3 caracteres'),
        neighborhood: z
            .string()
            .min(3, 'O bairro deve ter no mínimo 3 caracteres'),
        fullAddress: z
            .string()
            .min(3, 'O endereço deve ter no mínimo 3 caracteres'),
    })
    .required();

export type AddressInfoDto = z.infer<typeof addressInfoSchema>;
