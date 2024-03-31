import supertest from "supertest";
import { createApp } from "../../src/Utils/api.helper";
import { authorizationTokenTest, createUserTest, idUserTest, userTest } from "../../src/Utils/tests.helper";
import { LoginService } from "../../src/services/login.service";
import { prismaMock } from "../config/prisma.mock";
import { UserService } from "../../src/services/user.service";
import { any } from "jest-mock-extended";

describe('test create user', () => {
    test('should return 400 if the necessary data to create a user is not provided', async () => {
        const sut = createApp()

        const result = await supertest(sut).post(`/`).send({})

        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result.statusCode).toEqual(400)
        expect(result.body).toHaveProperty("message", "Fill in all mandatory fields")
    });

    test('should return 500 if the user creation process failed', async () => {
        const sut = createApp();

        // Mock middleware and user existence
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
        prismaMock.user.findUnique.mockResolvedValue(userTest);

        // Mocking controller
        jest.spyOn(UserService.prototype, 'createUser').mockRejectedValue(any)

        const result = await supertest(sut).post(`/`).send(createUserTest)

        expect(result).toBeDefined();
        expect(result.ok).toEqual(false);
        expect(result.statusCode).toEqual(500);
        expect(result.body).toHaveProperty("message",);
    });

    test('should return 200 if a user is created', async () => {
        const sut = createApp();

        // Mock middleware and user existence
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
        prismaMock.user.findUnique.mockResolvedValue(userTest);

        // Mocking controller
        jest.spyOn(UserService.prototype, 'createUser').mockResolvedValue({
            ok: true,
            code: 200,
            message: "User created.",
            data: userTest
        })

        const result = await supertest(sut).post(`/`).send({
            name: "nameTeste",
            email: "emailTeste",
            username: "username1",
            password: "passwordTeste"
        })

        expect(result).toBeDefined();
        expect(result.ok).toEqual(true);
        expect(result.statusCode).toEqual(200);
        expect(result.body).toHaveProperty("message", "User created.");

        expect(result.body.data).toHaveProperty("idUser")
        expect(result.body.data).toHaveProperty("email")
        expect(result.body.data).toHaveProperty("dthrCreated")
        expect(result.body.data).toHaveProperty("dthrUpdated")
        expect(result.body.data).toHaveProperty("name")
        expect(result.body.data).toHaveProperty("password")
        expect(result.body.data).toHaveProperty("photo")
        expect(result.body.data).toHaveProperty("token")
        expect(result.body.data).toHaveProperty("username")
    });
});

describe('test update user', () => {
    test('should return 400 if no update data is provided', async () => {
        const sut = createApp()

        // Mock middleware and user existence
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
        prismaMock.user.findUnique.mockResolvedValue(userTest);

        const result = await supertest(sut).put(`/user/${idUserTest}`).send({}).set('Authorization', authorizationTokenTest);


        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result.statusCode).toEqual(400)
        expect(result.body).toHaveProperty("message", "Enter at least one field to update! Name, email, username or password.")
    });

    test('should return 500 if the user update process fails', async () => {
        const sut = createApp()

        // Mock middleware and user existence
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
        prismaMock.user.findUnique.mockResolvedValue(userTest);

        // router
        jest.spyOn(UserService.prototype, 'updateUser').mockRejectedValue(any)

        const result = await supertest(sut).put(`/user/${idUserTest}`).send(createUserTest).set('Authorization', authorizationTokenTest);


        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result.statusCode).toEqual(500)
        expect(result.body).toHaveProperty("message")
    });

    test('should return 200 if a user is updated', async () => {
        const sut = createApp()

        // Mock middleware and user existence
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
        prismaMock.user.findUnique.mockResolvedValue(userTest);

        // router
        jest.spyOn(UserService.prototype, 'updateUser').mockResolvedValue({
            ok: true,
                code:200,
                message: "User updated.",
                data:createUserTest
        })

        const result = await supertest(sut).put(`/user/${idUserTest}`).send(createUserTest).set('Authorization', authorizationTokenTest);


        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty("message", "User updated.")
    });
});

describe('test delete user', () => {
  test.skip('should return 500 if the process of deleting the user failed', async () => {
    const sut = createApp()
     // Mock middleware and user existence
     jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
     prismaMock.user.findUnique.mockRejectedValue(userTest);

     // Mocking controller
     jest.spyOn(UserService.prototype, 'createUser').mockRejectedValue(any)

    const result = await supertest(sut).post(`/`).send(idUserTest)

    expect(result).toBeDefined()
    expect(result.ok).toEqual(false)
    expect(result.statusCode).toEqual(500)
    expect(result.body).toHaveProperty("message", "Fill in all mandatory fields")
  });
  test.skip('should return 200 if user is deleted', async () => {
    const sut = createApp()
     // Mock middleware and user existence
     jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
     prismaMock.user.findUnique.mockResolvedValue(userTest);

     // Mocking controller
     jest.spyOn(UserService.prototype, 'createUser').mockResolvedValue(
        {
            ok: true,
            code:200,
            message: `${userTest.username} was excluded.`
        }
     )

    const result = await supertest(sut).post(`/`).send(idUserTest)

    expect(result).toBeDefined()
    expect(result.ok).toEqual(true)
    expect(result.statusCode).toEqual(200)
    expect(result.body).toHaveProperty("message", "Fill in all mandatory fields")
  });
})
