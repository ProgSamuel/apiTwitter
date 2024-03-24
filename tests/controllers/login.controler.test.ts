import supertest from "supertest";
import { createApp } from "../../src/Utils/api.helper";

describe('Integrated tests for login via API', () => {
    test('should return 400 if the email or username and password is not provided ', async () => {
        // SUT => when testing for the api, it will be the api itself
        const sut = createApp()

        // methodo
        const result = await supertest(sut).post('/user/login').send({})

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result.statusCode).toEqual(400)
        expect(result.body).toHaveProperty("message",'Fill in all mandatory fields' )
    })

})
