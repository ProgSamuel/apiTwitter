import supertest from "supertest";
import { createApp } from "../../src/Utils/api.helper";
import { authorizationTokenTest, contentTest, idTweetTest, idUserTest, replyTest, tweetTest, userTest } from "../../src/Utils/tests.helper";
import { LoginService } from "../../src/services/login.service";
import { prismaMock } from "../config/prisma.mock";
import { ReplyService } from "../../src/services/reply.service";
import { any } from "jest-mock-extended";

describe('test reply tweet', () => {
    test('should return 400 if no content is provided for the reply to the tweet', async () => {
        const sut = createApp();

        // Mock middleware and user existence
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
        prismaMock.user.findUnique.mockResolvedValue(userTest);

        // Mocking controller

        const result = await supertest(sut).post(`/user/${idUserTest}/reply/${idTweetTest}`).send({}).set('Authorization', authorizationTokenTest)

        expect(result).toBeDefined();
        expect(result.ok).toEqual(false);
        expect(result.statusCode).toEqual(400);
        expect(result.body).toHaveProperty("message", 'Fill in all mandatory fields');
    });
    test('should return 404 if no tweet is found to reply', async () => {
        const sut = createApp();

        // Mock middleware and user existence
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
        prismaMock.user.findUnique.mockResolvedValue(userTest);

        // Mocking controller
        prismaMock.twitter.findUnique.mockResolvedValue(null)

        const result = await supertest(sut).post(`/user/${idUserTest}/reply/${idTweetTest}`).send({ 'content': contentTest }).set('Authorization', authorizationTokenTest)

        expect(result).toBeDefined();
        expect(result.ok).toEqual(false);
        expect(result.statusCode).toEqual(404);
        expect(result.body).toHaveProperty("message", 'Tweet does not exist');
    });
    test('should return 201 if a reply to a tweet is created', async () => {
        const sut = createApp();

        // Mock middleware and user existence
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
        prismaMock.user.findUnique.mockResolvedValue(userTest);

        // Mocking controller
        prismaMock.twitter.findUnique.mockResolvedValue(tweetTest)
        jest.spyOn(ReplyService.prototype, 'replyTwitter').mockResolvedValue({
            ok: true,
            code: 201,
            message: "Reply created successfully.",
            data: replyTest
        })

        const result = await supertest(sut).post(`/user/${idUserTest}/reply/${idTweetTest}`).send({ 'content': contentTest }).set('Authorization', authorizationTokenTest)

        expect(result).toBeDefined();
        expect(result.ok).toEqual(true);
        expect(result.statusCode).toEqual(201);
        expect(result.body).toHaveProperty("message", 'Reply created successfully.')
        expect(result.body).toHaveProperty("data")

    });
    test('should return 500 if there is a failure in the process of creating a reply to a tweet', async () => {
        const sut = createApp();

        // Mock middleware and user existence
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
        prismaMock.user.findUnique.mockResolvedValue(userTest);

        // Mocking controller
        prismaMock.twitter.findUnique.mockRejectedValue(any)

        const result = await supertest(sut).post(`/user/${idUserTest}/reply/${idTweetTest}`).send({ 'content': contentTest }).set('Authorization', authorizationTokenTest)

        expect(result).toBeDefined();
        expect(result.ok).toEqual(false);
        expect(result.statusCode).toEqual(500);
        expect(result.body).toHaveProperty("message")
    });
});

describe('test updater Reply', () => {
    test('should return 400 if no content is provided for the reply to the tweet', async () => {
        const sut = createApp();

        // Mock middleware and user existence
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
        prismaMock.user.findUnique.mockResolvedValue(userTest);

        // Mocking controller

        const result = await supertest(sut).put(`/user/${idUserTest}/reply/${idTweetTest}`).send({}).set('Authorization', authorizationTokenTest)

        expect(result).toBeDefined();
        expect(result.ok).toEqual(false);
        expect(result.statusCode).toEqual(400);
        expect(result.body).toHaveProperty("message", 'Fill in all mandatory fields');
    });
    test('should return 404 if no tweet is found to reply ', async () => {
        const sut = createApp();

        // Mock middleware and user existence
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
        prismaMock.user.findUnique.mockResolvedValue(userTest);

        // Mocking controller
        prismaMock.twitter.findUnique.mockResolvedValue(null)

        const result = await supertest(sut).put(`/user/${idUserTest}/reply/${idTweetTest}`).send({ 'content': contentTest }).set('Authorization', authorizationTokenTest)

        expect(result).toBeDefined();
        expect(result.ok).toEqual(false);
        expect(result.statusCode).toEqual(404);
        expect(result.body).toHaveProperty("message", 'Tweet does not exist');
    });
    test('should return 409 if the user tries to update a tweet reply that is not theirs', async () => {
        const sut = createApp();

        // Mock middleware and user existence
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
        prismaMock.user.findUnique.mockResolvedValue(userTest);

        // Mocking controller
        prismaMock.reply.findUnique.mockResolvedValue(replyTest)
        jest.spyOn(ReplyService.prototype, 'updaterReply').mockResolvedValue({
            ok: true,
            code: 200,
            message: "Updated tweet",
            data: replyTest
        })

        const result = await supertest(sut).put(`/user/${idUserTest + '1'}/reply/${idTweetTest}`).send({ 'content': contentTest }).set('Authorization', authorizationTokenTest)

        expect(result).toBeDefined();
        expect(result.ok).toEqual(false);
        expect(result.body).toHaveProperty("message", "Data conflict: Tweet does not match the User id entered.")
        expect(result.body.data).toBeUndefined()
    });
    test('should return 200 if a tweet reply is updated', async () => {
        const sut = createApp();

        // Mock middleware and user existence
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
        prismaMock.user.findUnique.mockResolvedValue(userTest);

        // Mocking controller
        prismaMock.reply.findUnique.mockResolvedValue(replyTest)
        jest.spyOn(ReplyService.prototype, 'updaterReply').mockResolvedValue({
            ok: true,
            code: 200,
            message: "Updated tweet",
            data: {
                replyContent: contentTest,
                dthrUpdated: new Date()
            }
        })

        const result = await supertest(sut).put(`/user/${idUserTest}/reply/${idTweetTest}`).send({ 'content': contentTest }).set('Authorization', authorizationTokenTest)

        expect(result).toBeDefined();
        expect(result.ok).toEqual(true);
        expect(result.statusCode).toEqual(200);
        expect(result.body).toHaveProperty("message", "Updated tweet")
        expect(result.body).toHaveProperty("data")
    });
    test('should return 500 if there is a failure in the process of updating a reply to a tweet', async () => {
        const sut = createApp();

        // Mock middleware and user existence
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
        prismaMock.user.findUnique.mockResolvedValue(userTest);

        // Mocking controller
        prismaMock.reply.findUnique.mockRejectedValue(any)

        const result = await supertest(sut).put(`/user/${idUserTest}/reply/${idTweetTest}`).send({ 'content': contentTest }).set('Authorization', authorizationTokenTest)

        expect(result).toBeDefined();
        expect(result.ok).toEqual(false);
        expect(result.statusCode).toEqual(500);
        expect(result.body).toHaveProperty("message")
    });
})

describe('test delete reply ', () => {
    test('should return 404 if no tweet is found to delete', async () => {
        const sut = createApp();

        // Mock middleware and user existence
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
        prismaMock.user.findUnique.mockResolvedValue(userTest);

        // Mocking controller
        prismaMock.reply.findUnique.mockResolvedValue(null)

        const result = await supertest(sut).delete(`/user/${idUserTest}/reply/${idTweetTest}`).set('Authorization', authorizationTokenTest)

        expect(result).toBeDefined();
        expect(result.ok).toEqual(false);
        expect(result.statusCode).toEqual(404);
        expect(result.body).toHaveProperty("message", 'Tweet does not exist');
    });
    test('should return 409 I know user tries to delete a tweet reply that is not yours', async () => {
        const sut = createApp();

        // Mock middleware and user existence
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
        prismaMock.user.findUnique.mockResolvedValue(userTest);

        // Mocking controller
        prismaMock.reply.findUnique.mockResolvedValue(replyTest)
        jest.spyOn(ReplyService.prototype, 'updaterReply').mockResolvedValue({
            ok: true,
            code: 200,
            message: "Updated tweet",
            data: replyTest
        })

        const result = await supertest(sut).delete(`/user/${idUserTest + '1'}/reply/${idTweetTest}`).set('Authorization', authorizationTokenTest)

        expect(result).toBeDefined();
        expect(result.ok).toEqual(false);
        expect(result.body).toHaveProperty("message", "Data conflict: Tweet does not match the User id entered.")
        expect(result.body.data).toBeUndefined()
    });
    test('should return 500 if there is a failure in the process of deleting a reply to a tweet', async () => {
        const sut = createApp();

        // Mock middleware and user existence
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
        prismaMock.user.findUnique.mockResolvedValue(userTest);

        // Mocking controller
        prismaMock.reply.findUnique.mockRejectedValue(any)

        const result = await supertest(sut).delete(`/user/${idUserTest}/reply/${idTweetTest}`).set('Authorization', authorizationTokenTest)

        expect(result).toBeDefined();
        expect(result.ok).toEqual(false);
        expect(result.statusCode).toEqual(500);
        expect(result.body).toHaveProperty("message")
    });
    test('should return 200 if a reply to a tweet is deleted', async () => {
        const sut = createApp();

        // Mock middleware and user existence
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true);
        prismaMock.user.findUnique.mockResolvedValue(userTest);

        // Mocking controller
        prismaMock.reply.findUnique.mockResolvedValue(replyTest)
        jest.spyOn(ReplyService.prototype, 'deleteReply').mockResolvedValue({
            ok: true,
            code: 200,
            message: "Tweet deleted."
        })

        const result = await supertest(sut).delete(`/user/${idUserTest}/reply/${idTweetTest}`).set('Authorization', authorizationTokenTest)

        expect(result).toBeDefined();
        expect(result.ok).toEqual(true);
        expect(result.body).toHaveProperty("message", "Tweet deleted.")
        expect(result.body.data).toBeUndefined()
    });
});