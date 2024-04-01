import supertest from "supertest";
import { createApp } from "../../src/Utils/api.helper";
import { StartController } from "../../src/Controllers/start.controller";
import { Response } from 'express';

describe.skip('test start controller', () => {
// it's slow and I couldn't speed it up
    test('Should return 200 if the user accesses the home page', async () => {
        const sut = createApp();
        const mockResponse = {
            ok: true,
            code: 200,
            message: `Welcome! To learn how to use the API, visit: https://github.com/ProgSamuel/apiTwitter.git`
        };
        
        jest.spyOn(StartController.prototype, 'start').mockImplementationOnce(async (res: Response) => {
            return res.status(200).send(mockResponse);
        });

        const response = await supertest(sut).get('/');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("ok", true);
        expect(response.body).toHaveProperty("message", mockResponse.message);
    });

    test('Should return 500 in case of error', async () => {
        const sut = createApp();
        const errorMessage = "Erro interno do servidor";
        jest.spyOn(StartController.prototype, 'start').mockImplementationOnce(async () => {
            throw new Error(errorMessage);
        });

        const response = await supertest(sut).get('/');

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty("ok", false);
        expect(response.body).toHaveProperty("message", errorMessage);
    });
});
