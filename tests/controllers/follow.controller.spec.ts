import supertest from "supertest";
import { createApp } from "../../src/Utils/api.helper";
import { prismaMock } from '../config/prisma.mock'
import { randomUUID } from "crypto";
import { any } from "jest-mock-extended";
import { LoginService } from "../../src/services/login.service";
import {idUserTest,idFollowTest,authorizationTokenTest,userTest, userTest2} from '../../src/Utils/tests.helper'

describe('test follow and unfollow', () => {
test('should return 404 if the user does not exist', async () => {
    const sut = createApp()
    // middlwware
    jest.spyOn(LoginService.prototype,"validateLogin").mockResolvedValue(true)
    prismaMock.user.findUnique.mockResolvedValue(userTest)

    // route
    prismaMock.user.findFirst.mockResolvedValue(null)

    const result = await supertest(sut).post(`/user/${idUserTest}/follow/${idFollowTest}`).
    set('Authorization', authorizationTokenTest)

    expect(result).toBeDefined()
    expect(result.ok).toEqual(false)
    expect(result.statusCode).toEqual(404)
    expect(result.body).toHaveProperty("message", "User does not exist")
});

test('should return 404 if the user to be followed does not exist', async () => {
    const sut = createApp();

    // Mock middleware and user existence
    jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
    prismaMock.user.findUnique.mockResolvedValue(userTest);

    // Mocking controller
    prismaMock.user.findFirst.mockResolvedValueOnce(userTest); 
    prismaMock.user.findFirst.mockResolvedValueOnce(null); 
    const result = await supertest(sut)
        .post(`/user/${idUserTest}/follow/${idFollowTest}`)
        .set('Authorization', authorizationTokenTest);

    expect(result).toBeDefined();
    expect(result.ok).toEqual(false);
    expect(result.statusCode).toEqual(404);
    expect(result.body).toHaveProperty("message", "Followed does not exist");
});
test('should return 400 if the user tries to follow himself', async () => {
    const sut = createApp();

    // Mock middleware and user existence
    jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
    prismaMock.user.findUnique.mockResolvedValue(userTest);

    const result = await supertest(sut)
        .post(`/user/${idUserTest}/follow/${idUserTest}`)
        .set('Authorization', authorizationTokenTest);

    expect(result).toBeDefined();
    expect(result.ok).toEqual(false);
    expect(result.statusCode).toEqual(400);
    expect(result.body).toHaveProperty("message", "User cannot follow themselves");
});
test('should return 500 if there is any failure in the following process', async () => {
    const sut = createApp();

    // Mock middleware and user existence
    jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
    prismaMock.user.findUnique.mockResolvedValue(userTest);

    // Mocking controller
    prismaMock.user.findFirst.mockRejectedValue(any) 
    const result = await supertest(sut)
        .post(`/user/${idUserTest}/follow/${idFollowTest}`)
        .set('Authorization', authorizationTokenTest);

    expect(result).toBeDefined();
    expect(result.ok).toEqual(false);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toHaveProperty("message");
});
test('should return 201 start following someone', async () => {
    const sut = createApp();

    // Mock middleware and user existence
    jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
    prismaMock.user.findUnique.mockResolvedValue(userTest);

    // Mocking controller
    prismaMock.user.findFirst.mockResolvedValueOnce(userTest); 
    prismaMock.user.findFirst.mockResolvedValueOnce(userTest2);
    prismaMock.followers.findFirst.mockResolvedValueOnce(null) 
    const result = await supertest(sut)
        .post(`/user/${idUserTest}/follow/${idFollowTest}`)
        .set('Authorization', authorizationTokenTest);

    expect(result).toBeDefined();
    expect(result.ok).toEqual(true);
    expect(result.statusCode).toEqual(201);
    expect(result.body).toHaveProperty("message", "username1 started following username2");
});
test('should return 201 unfollow someone', async () => {
    const sut = createApp();

    // Mock middleware and user existence
    jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
    prismaMock.user.findUnique.mockResolvedValue(userTest);

    // Mocking controller
    prismaMock.user.findFirst.mockResolvedValueOnce(userTest); 
    prismaMock.user.findFirst.mockResolvedValueOnce(userTest2);
    prismaMock.followers.findFirst.mockResolvedValueOnce({
        id: randomUUID(),
        idFollowing: userTest2.idUser,
        idUser:userTest.idUser,
        dthrCreated: new Date(),
        dthrUpdated: new Date()
    }) 
    const result = await supertest(sut)
        .post(`/user/${idUserTest}/follow/${idFollowTest}`)
        .set('Authorization', authorizationTokenTest);

    expect(result).toBeDefined();
    expect(result.ok).toEqual(true);
    expect(result.statusCode).toEqual(201);
    expect(result.body).toHaveProperty("message", "username1 unfollowed username2");
});
});