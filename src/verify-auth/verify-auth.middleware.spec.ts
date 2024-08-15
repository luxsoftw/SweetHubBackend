import { VerifyAuthMiddleware } from './verify-auth.middleware';

describe('VerifyAuthMiddleware', () => {
    it('should be defined', () => {
        expect(new VerifyAuthMiddleware()).toBeDefined();
    });
});
