import supertest from "supertest";
import { createApp } from "../../src/Utils/api.helper";

describe.skip('Teste do controlador de início', () => {

    test('Deve retornar 200 se o usuário acessar a página inicial', async () => {
        const sut = createApp();

        const response = await supertest(sut).get('/');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("ok", true);
        expect(response.body).toHaveProperty("message", "Welcome! To learn how to use the API, visit: https://github.com/ProgSamuel/apiTwitter.git");
    });

    // test('Deve retornar 500 se houver um erro ao acessar a página inicial', async () => {
    //     // Suponha que sua API retorne 500 em caso de erro interno do servidor.
    //     // Você pode simular um erro, por exemplo, acessando um endpoint inexistente.
    //     const response = await supertest(app).get('/endpoint-inexistente');

    //     expect(response.status).toBe(500);
    // });
});
