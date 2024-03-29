import supertest from "supertest";
import { createApp } from "../../src/Utils/api.helper";
import { LoginService } from "../../src/services/login.service";
import { any } from "jest-mock-extended";
import { prismaMock } from "../config/prisma.mock";
import { userLoginTest, userLoginUsernameTest, userTest } from "../../src/Utils/tests.helper";



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
        expect(result.body).toHaveProperty("message", 'Fill in all mandatory fields')
    })
    test('should return 500 if the login process fails', async () => {
        const sut = createApp()
        jest.spyOn(LoginService.prototype, 'loginEmail').mockRejectedValue(any)

        // methodo
        const result = await supertest(sut).post('/user/login').send(userLoginTest)

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result.statusCode).toEqual(500)
        expect(result.body).toHaveProperty("message")
    });
    test('should return 200 if logged in with email', async () => {
        const sut = createApp()
        // middlwware
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true)
        prismaMock.user.findUnique.mockResolvedValue(userTest)

        // route
        jest.spyOn(LoginService.prototype, 'loginEmail').mockResolvedValue({
            ok: true,
            code: 200,
            message: 'Login ok',
            data: userTest
        })

        const result = await supertest(sut).post('/user/login').send(userLoginTest)

        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty("message",'Login ok')
        expect(result.body).toHaveProperty("data")
        expect(result.body.data).toHaveProperty("idUser")
        expect(result.body.data).toHaveProperty("email")
        expect(result.body.data).toHaveProperty("username")
        expect(result.body.data).toHaveProperty("password")
    });
    test('should return 200 if logged in with username', async () => {
        const sut = createApp()
        // middlwware
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true)
        prismaMock.user.findUnique.mockResolvedValue(userTest)

        // route
        jest.spyOn(LoginService.prototype, 'loginUsername').mockResolvedValue({
            ok: true,
            code: 200,
            message: 'Login ok',
            data: userTest
        })

        const result = await supertest(sut).post('/user/login').send(userLoginUsernameTest)

        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty("message",'Login ok')
        expect(result.body).toHaveProperty("data")
        expect(result.body.data).toHaveProperty("idUser")
        expect(result.body.data).toHaveProperty("email")
        expect(result.body.data).toHaveProperty("username")
        expect(result.body.data).toHaveProperty("password")
    });
})
