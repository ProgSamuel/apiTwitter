import supertest from "supertest";
import { createApp } from "../../src/Utils/api.helper";
import { prismaMock } from '../config/prisma.mock'
import { LoginController } from "../../src/Controllers/login.controler";
import { randomUUID } from "crypto";
import { any } from "jest-mock-extended";

const idUser = randomUUID()
const idFollow = randomUUID()
const authorizationToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNhNjkwOTgxLWI5YWEtNDY1NS1iZjEyLTM3M2RjYmJjMGNjYiIsInVzZXJuYW1lIjoidXNlcmRhdmlzIiwiZW1haWwiOiJkYXZpczMwM0BleGFtcGxlLmNvbSIsImlhdCI6MTcxMDQ1MTIzNSwiZXhwIjoxNzEwNDU0ODM1fQ.dpb90pcPSKcxe-I2r144-YzCQxXKoUcaaAuVu51_tE4"

const user = {
    idUser:idUser,
    email: "email1",
    dthrCreated: new Date(),
    dthrUpdated: new Date(),
    name: "name1",
    password: "username1",
    photo: "photo1",
    token: authorizationToken,
    username: "username1"
}
const user2 = {
    idUser:idFollow,
    email: "email2",
    dthrCreated: new Date(),
    dthrUpdated: new Date(),
    name: "name2",
    password: "username2",
    photo: "photo2",
    token: authorizationToken,
    username: "username2"
}
describe('test follow and unfollow', () => {
test('should return 404 if the user does not exist', async () => {
    const sut = createApp()
    // middlwware
    jest.spyOn(LoginController.prototype,"validateLogin").mockResolvedValue(true)
    prismaMock.user.findUnique.mockResolvedValue(user)

    // route
    prismaMock.user.findFirst.mockResolvedValue(null)

    const result = await supertest(sut).post(`/user/${idUser}/follow/${idFollow}`).
    set('Authorization', authorizationToken)

    expect(result).toBeDefined()
    expect(result.ok).toEqual(false)
    expect(result.statusCode).toEqual(404)
    expect(result.body).toHaveProperty("message", "User does not exist")
});

test('should return 404 if the user to be followed does not exist', async () => {
    const sut = createApp();

    // Mock middleware and user existence
    jest.spyOn(LoginController.prototype, "validateLogin").mockResolvedValue(true);
    prismaMock.user.findUnique.mockResolvedValue(user);

    // Mocking controller
    prismaMock.user.findFirst.mockResolvedValueOnce(user); 
    prismaMock.user.findFirst.mockResolvedValueOnce(null); 
    const result = await supertest(sut)
        .post(`/user/${idUser}/follow/${idFollow}`)
        .set('Authorization', authorizationToken);

    expect(result).toBeDefined();
    expect(result.ok).toEqual(false);
    expect(result.statusCode).toEqual(404);
    expect(result.body).toHaveProperty("message", "Followed does not exist");
});
test('should return 400 if the user tries to follow himself', async () => {
    const sut = createApp();

    // Mock middleware and user existence
    jest.spyOn(LoginController.prototype, "validateLogin").mockResolvedValue(true);
    prismaMock.user.findUnique.mockResolvedValue(user);

    const result = await supertest(sut)
        .post(`/user/${idUser}/follow/${idUser}`)
        .set('Authorization', authorizationToken);

    expect(result).toBeDefined();
    expect(result.ok).toEqual(false);
    expect(result.statusCode).toEqual(400);
    expect(result.body).toHaveProperty("message", "User cannot follow themselves");
});
test('should return 500 if there is any failure in the following process', async () => {
    const sut = createApp();

    // Mock middleware and user existence
    jest.spyOn(LoginController.prototype, "validateLogin").mockResolvedValue(true);
    prismaMock.user.findUnique.mockResolvedValue(user);

    // Mocking controller
    prismaMock.user.findFirst.mockRejectedValue(any) 
    const result = await supertest(sut)
        .post(`/user/${idUser}/follow/${idFollow}`)
        .set('Authorization', authorizationToken);

    expect(result).toBeDefined();
    expect(result.ok).toEqual(false);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toHaveProperty("message");
});
test('should return 201 start following someone', async () => {
    const sut = createApp();

    // Mock middleware and user existence
    jest.spyOn(LoginController.prototype, "validateLogin").mockResolvedValue(true);
    prismaMock.user.findUnique.mockResolvedValue(user);

    // Mocking controller
    prismaMock.user.findFirst.mockResolvedValueOnce(user); 
    prismaMock.user.findFirst.mockResolvedValueOnce(user2);
    prismaMock.followers.findFirst.mockResolvedValueOnce(null) 
    const result = await supertest(sut)
        .post(`/user/${idUser}/follow/${idFollow}`)
        .set('Authorization', authorizationToken);

    expect(result).toBeDefined();
    expect(result.ok).toEqual(true);
    expect(result.statusCode).toEqual(201);
    expect(result.body).toHaveProperty("message", "username1 started following username2");
});
test('should return 201 unfollow someone', async () => {
    const sut = createApp();

    // Mock middleware and user existence
    jest.spyOn(LoginController.prototype, "validateLogin").mockResolvedValue(true);
    prismaMock.user.findUnique.mockResolvedValue(user);

    // Mocking controller
    prismaMock.user.findFirst.mockResolvedValueOnce(user); 
    prismaMock.user.findFirst.mockResolvedValueOnce(user2);
    prismaMock.followers.findFirst.mockResolvedValueOnce({
        id: randomUUID(),
        idFollowing: user2.idUser,
        idUser:user.idUser,
        dthrCreated: new Date(),
        dthrUpdated: new Date()
    }) 
    const result = await supertest(sut)
        .post(`/user/${idUser}/follow/${idFollow}`)
        .set('Authorization', authorizationToken);

    expect(result).toBeDefined();
    expect(result.ok).toEqual(true);
    expect(result.statusCode).toEqual(201);
    expect(result.body).toHaveProperty("message", "username1 unfollowed username2");
});
});