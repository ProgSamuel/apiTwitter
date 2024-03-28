import supertest from "supertest";
import { createApp } from "../../src/Utils/api.helper";
import { StartController } from "../../src/Controllers/start.controller";
import { any } from "jest-mock-extended";

describe.skip('Teste do controlador de início', () => {

    test.skip('Deve retornar 200 se o usuário acessar a página inicial', async () => {
        const sut = createApp();

        const response = await supertest(sut).get('/');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("ok", true);
        expect(response.body).toHaveProperty("message", "Welcome! To learn how to use the API, visit: https://github.com/ProgSamuel/apiTwitter.git");
    });

    test('should ',async () => {
        const sut = createApp()
        jest.spyOn(StartController.prototype, "start").mockRejectedValue(any)

        const result = await supertest(sut).get('/');
        expect(result.status).toBe(500);
        expect(result.body).toHaveProperty("ok", false);
        expect(result.body).toHaveProperty("message", "t");
    });
});
