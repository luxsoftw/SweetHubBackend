import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ValidatorsPipe implements PipeTransform {
    constructor(private zodSchema: ZodSchema) {}
    async transform(value: any) {
        try {
            return await this.zodSchema.parseAsync(value);
        } catch (error) {
            throw new BadRequestException(error.errors);
        }
    }
}
