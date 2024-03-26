import supertest from "supertest";
import { createApp } from "../../src/Utils/api.helper";
import { prismaMock } from '../config/prisma.mock'

const idUser = "3a690981-b9aa-4655-bf12-373dcbbc0ccb"
const idFollow = "6d48e03d-e4b5-43e5-84a1-c0e0556b525b"
const authorizationToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNhNjkwOTgxLWI5YWEtNDY1NS1iZjEyLTM3M2RjYmJjMGNjYiIsInVzZXJuYW1lIjoidXNlcmRhdmlzIiwiZW1haWwiOiJkYXZpczMwM0BleGFtcGxlLmNvbSIsImlhdCI6MTcxMDQ1MTIzNSwiZXhwIjoxNzEwNDU0ODM1fQ.dpb90pcPSKcxe-I2r144-YzCQxXKoUcaaAuVu51_tE4"

const user = {
    idUser:idUser,
    email: "",
    dthrCreated: new Date(),
    dthrUpdated: new Date(),
    name: "",
    password: "",
    photo: "",
    token: authorizationToken,
    username: ""
}
describe('test follow', () => {
test.skip('should return 404 if the user to be followed does not exist ', async () => {
    const sut = createApp()
    prismaMock.user.findFirst.mockReturnValue(null!)

    const result = await supertest(sut).post(`/user/${idUser}/follow/${idFollow}`).
    set('Authorization', authorizationToken)

    expect(result).toBeDefined()
    expect(result.ok).toEqual(false)
    expect(result.statusCode).toEqual(404)
    expect(result.body).toHaveProperty("message", "User or followed does not exist")
});
});