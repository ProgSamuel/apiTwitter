import supertest from "supertest";
import { createApp } from "../../src/Utils/api.helper";
import { prismaMock } from '../config/prisma.mock'
import { any } from "jest-mock-extended";

const idUser = "3a690981-b9aa-4655-bf12-373dcbbc0ccb"
const idFollow = "6d48e03d-e4b5-43e5-84a1-c0e0556b525b"
const authorizationToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNhNjkwOTgxLWI5YWEtNDY1NS1iZjEyLTM3M2RjYmJjMGNjYiIsInVzZXJuYW1lIjoidXNlcmRhdmlzIiwiZW1haWwiOiJkYXZpczMwM0BleGFtcGxlLmNvbSIsImlhdCI6MTcxMDQ1MTIzNSwiZXhwIjoxNzEwNDU0ODM1fQ.dpb90pcPSKcxe-I2r144-YzCQxXKoUcaaAuVu51_tE4"

describe('test checkId - middleware', () => {
    test('should return 401 if token was not provided', async () => {
        const sut = createApp()
        prismaMock.user.findUnique.mockReturnValue(null!)

        const result = await supertest(sut).post(`/user/${idUser}/follow/${idFollow}`)

        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result.statusCode).toEqual(401)
        expect(result.body).toHaveProperty("message", "Authentication token not provided")
    });

    test('should return 404 if user does not exist', async () => {
        const sut = createApp()
        prismaMock.user.findUnique.mockReturnValue(null!)

        const result = await supertest(sut).post(`/user/${idUser}/follow/${idFollow}`).set('Authorization', authorizationToken)

        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result.statusCode).toEqual(404)
        expect(result.body).toHaveProperty("message", 'User does not exist')
    });

    test('should return 500 if there is any failure in the process of verifying the id and token ', async () => {
        const sut = createApp()
        prismaMock.user.findUnique.mockRejectedValue(any)

        const result = await supertest(sut).post(`/user/${idUser}/follow/${idFollow}`).set('Authorization', authorizationToken)

        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result.statusCode).toEqual(500)
        expect(result.body).toHaveProperty("message")
    });
});