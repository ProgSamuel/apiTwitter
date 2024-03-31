import { any } from 'jest-mock-extended';
import { UserService } from '../../src/services/user.service'
import { prismaMock } from '../config/prisma.mock'
import * as dotenv from "dotenv";
dotenv.config();

describe('test create user', () => {
    test('should return 409 if the email exists ', async () => {
        const sut = new UserService()
        prismaMock.user.findFirst.mockResolvedValue({
            name: "name_qualquer",
            username: "username_qualquer",
            email: "email_qualquer",
            idUser: "id_qualquer",
            password: "pass_qualquer",
            dthrCreated: new Date(),
            dthrUpdated: new Date(),
            token: null,
            photo: null
        })

        const result = await sut.createUser({
            name: "name_qualquer",
            username: "username_qualquer",
            email: "email_qualquer",
            password: "pass_qualquer",
        })

        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 409)
        expect(result).toHaveProperty("message", "Email already exists")
        expect(result.data).toBeUndefined()
    });

    test('should return 409 if the username exists ', async () => {
        const sut = new UserService()
        prismaMock.user.findFirst.mockReturnValue(null!)

        prismaMock.user.findUnique.mockResolvedValue({
            name: "name_qualquer",
            username: "username_qualquer_1",
            email: "email_qualquer",
            idUser: "id_qualquer",
            password: "pass_qualquer",
            dthrCreated: new Date(),
            dthrUpdated: new Date(),
            token: null,
            photo: null
        })

        const result = await sut.createUser({
            name: "name_qualquer",
            username: "username_qualquer_1",
            email: "Email_test",
            password: "pass_qualquer",
        })

        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 409)
        expect(result).toHaveProperty("message", "Username already exists")
        expect(result.data).toBeUndefined()
    });

    test('should return 200 if a user is created', async () => {
        const sut = new UserService()

        prismaMock.user.findFirst.mockReturnValue(null!)
        prismaMock.user.findUnique.mockResolvedValue(null!)

        const result = await sut.createUser({
            name: "name_qualquer",
            username: "username_qualquer_1",
            email: "Email_test",
            password: "pass_qualquer",
        })

        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", "User created.")
        expect(result).toHaveProperty("data")
    });

    test('should return 500 if there is any failure in the user creation process', async () => {
        const sut = new UserService()

        prismaMock.user.findFirst.mockRejectedValue(any)

        const result = await sut.createUser({
            name: "name_qualquer",
            username: "username_qualquer_1",
            email: "Email_test",
            password: "pass_qualquer",
        })

        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 500)
        expect(result).toHaveProperty("message")
        expect(result.data).toBeUndefined()
    });
})

describe('test delete user', () => {
    test('should return 404 if user does not exist ', async () => {
        const sut = new UserService()
        prismaMock.user.findFirst.mockReturnValue(null!)

        const result = await sut.deleteUser("id_qualquer")

        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", 'User does not exist.')
        expect(result.data).toBeUndefined()
    });

    test('should return 200 if user is deleted', async () => {
        const sut = new UserService()
        prismaMock.user.findFirst.mockResolvedValue({
            name: "name_qualquer",
            username: "username_qualquer_1",
            email: "email_qualquer",
            idUser: "id_qualquer",
            password: "pass_qualquer",
            dthrCreated: new Date(),
            dthrUpdated: new Date(),
            token: null,
            photo: null
        })

        const result = await sut.deleteUser("id_qualquer")

        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message")
        expect(result.message).toContain("was excluded.")
        expect(result.data).toBeUndefined()
    });

    test('should return 500 if there is any failure in the user deletion process', async () => {
        const sut = new UserService()
        prismaMock.user.findFirst.mockRejectedValue(any)

        const result = await sut.deleteUser("id_qualquer")

        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 500)
        expect(result).toHaveProperty("message")
        expect(result.data).toBeUndefined()
    });
})

describe('test update user', () => {
    test('should return 404 if user does not exist', async () => {
        const sut = new UserService()
        prismaMock.user.findFirst.mockReturnValue(null!)
        const result = await sut.updateUser({
            idUser:"idUser_qualquer"
        })

        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", 'User does not exist')
        expect(result.data).toBeUndefined()
    });
    test('should return 409 if email exists', async () => {
        const sut = new UserService()

        prismaMock.user.findFirst.mockResolvedValue({
            name: "name_qualquer",
            username: "username_qualquer_1",
            email: "email_qualquer",
            idUser: "id_qualquer",
            password: "pass_qualquer",
            dthrCreated: new Date(),
            dthrUpdated: new Date(),
            token: null,
            photo: null
        })

        prismaMock.user.findUnique.mockResolvedValue({
            name: "name_qualquer",
            username: "username_qualquer_1",
            email: "email_qualquer",
            idUser: "id_qualquer",
            password: "pass_qualquer",
            dthrCreated: new Date(),
            dthrUpdated: new Date(),
            token: null,
            photo: null
        })


        const result = await sut.updateUser({
            idUser: "id_qualquer",
            email: "email_qualquer",
        })

        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 409)
        expect(result).toHaveProperty("message", "Email already exists")
        expect(result.data).toBeUndefined()

    });
    test('should return 409 if username exists', async () => {
        const sut = new UserService()

        prismaMock.user.findFirst.mockResolvedValue({
            name: "name_qualquer",
            username: "username_qualquer_1",
            email: "email_qualquer",
            idUser: "id_qualquer",
            password: "pass_qualquer",
            dthrCreated: new Date(),
            dthrUpdated: new Date(),
            token: null,
            photo: null
        })

        prismaMock.user.findUnique.mockResolvedValue({
            name: "name_qualquer",
            username: "username_qualquer_1",
            email: "email_qualquer",
            idUser: "id_qualquer",
            password: "pass_qualquer",
            dthrCreated: new Date(),
            dthrUpdated: new Date(),
            token: null,
            photo: null
        })

        const result = await sut.updateUser({
            idUser: "id_qualquer",
            username: "username_qualquer_1",
        })

        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 409)
        expect(result).toHaveProperty("message", "Username already exists")
        expect(result.data).toBeUndefined()
    });
    test('should return 200 if user is updated', async () => {
        const sut = new UserService()
        prismaMock.user.findFirst.mockResolvedValue({
            name: "name_qualquer",
            username: "username_qualquer_1",
            email: "email_qualquer",
            idUser: "id_qualquer",
            password: "pass_qualquer",
            dthrCreated: new Date(),
            dthrUpdated: new Date(),
            photo: null,
            token:null
        })
        prismaMock.user.update.mockResolvedValue({
            name: "name_qualquer",
            username: "username_qualquer_1",
            email: "email_qualquer2",
            idUser: "id_qualquer",
            password: "pass_qualquer",
            dthrCreated: new Date(),
            dthrUpdated: new Date(),
            token: null,
            photo: null
        })

        const result = await sut.updateUser({
            name: "name_qualquer_8",
            username: "username_qualquer_8",
            email: "email_qualquer_8",
            idUser: "id_qualquer",
            password: "pass_qualquer_8"
        })
        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message",  "User updated.")
        expect(result.data).toBeDefined()
        expect(result.data).toHaveProperty("name")
        expect(result.data).toHaveProperty("email")
        expect(result.data).toHaveProperty("idUser")
        expect(result.data).toHaveProperty("dthrUpdated")
    });
    test('should return 500 if there is any failure in the user update process', async () => {
        const sut = new UserService()
        prismaMock.user.findFirst.mockRejectedValue(any)

        const result = await sut.updateUser({
            name: "name_qualquer_1",
            username: "username_qualquer_2",
            email: "email_qualquer_1",
            idUser: "id_qualquer",
            password: "pass_qualquer_1"
        })
        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 500)
        expect(result).toHaveProperty("message")
        expect(result.data).toBeUndefined()
    
    });
});


