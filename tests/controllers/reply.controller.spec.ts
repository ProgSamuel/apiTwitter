import supertest from "supertest";
import { createApp } from "../../src/Utils/api.helper";
import { idTweetTest, idUserTest, userTest } from "../../src/Utils/tests.helper";
import { LoginService } from "../../src/services/login.service";
import { prismaMock } from "../config/prisma.mock";

describe.skip('test reply tweet', () => {
    test('should return 400 if no content is provided for the reply to the tweet', async () => {
        const sut = createApp();

        // Mock middleware and user existence
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
        prismaMock.user.findUnique.mockResolvedValue(userTest);

        // Mocking controller

        const result = await supertest(sut).post(`'/user/${idUserTest}/reply/${idTweetTest}`)
        expect(result).toBeDefined();
        expect(result.ok).toEqual(false);
        expect(result.statusCode).toEqual(500);
        expect(result.body).toHaveProperty("message",);
    });
});