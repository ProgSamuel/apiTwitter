import supertest from "supertest";
import { createApp } from "../../src/Utils/api.helper";
import { authorizationTokenTest, contentTest, homeTest, idTweetTest, idUserTest, tweetTest, userTest } from "../../src/Utils/tests.helper";
import { LoginService } from "../../src/services/login.service";
import { prismaMock } from "../config/prisma.mock";
import { TwitterService } from "../../src/services/tweet.service";
import { any } from "jest-mock-extended";

describe('test create tweet', () => {
    test('should return 400 if content is provided ', async () => {
        const sut = createApp()
        // middlwware
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true)
        prismaMock.user.findUnique.mockResolvedValue(userTest)

        // methodos
        const result = await supertest(sut).post(`/user/${idUserTest}`).send({}).set('Authorization', authorizationTokenTest)

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result.statusCode).toEqual(400)
        expect(result.body).toHaveProperty("message", "Fill in all mandatory fields")
        expect(result.body.data).toBeUndefined()
    });
    test('should return 200 if a tweet is created', async () => {
        const sut = createApp()
        // middlwware
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true)
        prismaMock.user.findUnique.mockResolvedValue(userTest)

        // router
        jest.spyOn(TwitterService.prototype, 'createTweet').mockResolvedValue({
            ok: true,
            code: 200,
            message: "Tweet created successfully.",
            data: tweetTest
        })
        // methodos
        const result = await supertest(sut).post(`/user/${idUserTest}`).send({ content: contentTest }).set('Authorization', authorizationTokenTest)

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty("message", "Tweet created successfully.")
        expect(result.body.data).toBeDefined()
        expect(result.body.data).toHaveProperty("idTwitter")
        expect(result.body.data).toHaveProperty("content")
        expect(result.body.data).toHaveProperty("type")
        expect(result.body.data).toHaveProperty("idUser")
        expect(result.body.data).toHaveProperty("dthrCreated")
        expect(result.body.data).toHaveProperty("dthrUpdated")
    });
    test('should return 500 if there is a failure in the tweet creation process', async () => {
        const sut = createApp()
        // middlwware
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true)
        prismaMock.user.findUnique.mockResolvedValue(userTest)

        // router
        jest.spyOn(TwitterService.prototype, 'createTweet').mockRejectedValue(any)
        // methodos
        const result = await supertest(sut).post(`/user/${idUserTest}`).send({ content: contentTest }).set('Authorization', authorizationTokenTest)

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result.statusCode).toEqual(500)
        expect(result.body).toHaveProperty("message")
        expect(result.body.data).toBeUndefined()

    });
});

describe('test view all tweets', () => {
    test('should return 200 if showing all tweets', async () => {
        const sut = createApp()
        // middlwware
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true)
        prismaMock.user.findUnique.mockResolvedValue(userTest)

        // router
        jest.spyOn(TwitterService.prototype, 'viewTweets').mockResolvedValue({
            ok: true,
            code: 200,
            message: 'Your home',
            data: homeTest
        })
        // methodos
        const result = await supertest(sut).get(`/user/${idUserTest}/home`).set('Authorization', authorizationTokenTest)

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty("message", 'Your home')
        expect(result.body).toHaveProperty("data")

    });
    test('should return 500 if there is a failure in the tweet display process', async () => {
        const sut = createApp()
        // middlwware
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true)
        prismaMock.user.findUnique.mockResolvedValue(userTest)

        // router
        jest.spyOn(TwitterService.prototype, 'viewTweets').mockRejectedValue(any)
        // methodos
        const result = await supertest(sut).get(`/user/${idUserTest}/home`).set('Authorization', authorizationTokenTest)

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result.statusCode).toEqual(500)
        expect(result.body).toHaveProperty("message")
        expect(result.body.data).toBeUndefined()
    });
});

describe('test view user tweets', () => {
    test('should return 200 if all user tweets are displayed', async () => {
        const sut = createApp()
        // middlwware
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true)
        prismaMock.user.findUnique.mockResolvedValue(userTest)

        // router
        jest.spyOn(TwitterService.prototype, 'tweetsUser').mockResolvedValue({
            ok: true,
            code: 200,
            message: `You has 0 tweets`,
            data: []
        })
        // methodos
        const result = await supertest(sut).get(`/user/${idUserTest}`).set('Authorization', authorizationTokenTest)

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty("message", "You has 0 tweets")
        expect(result.body).toHaveProperty("data")
    });
    test("should return 500 if there is a failure in the process of displaying the user's tweets", async () => {
        const sut = createApp()
        // middlwware
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true)
        prismaMock.user.findUnique.mockResolvedValue(userTest)

        // router
        jest.spyOn(TwitterService.prototype, 'tweetsUser').mockRejectedValue(any)
        // methodos
        const result = await supertest(sut).get(`/user/${idUserTest}`).set('Authorization', authorizationTokenTest)

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result.statusCode).toEqual(500)
        expect(result.body).toHaveProperty("message")
        expect(result.body.data).toBeUndefined()
    });
});

describe('test update tweet', () => {
    test('should return 400 if content for update is provided', async () => {
        const sut = createApp()
        // middlwware
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true)
        prismaMock.user.findUnique.mockResolvedValue(userTest)

        // router


        // methodos
        const result = await supertest(sut).put(`/user/${idUserTest}/twitter/${idTweetTest}`).send({}).set('Authorization', authorizationTokenTest)

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result.statusCode).toEqual(400)
        expect(result.body).toHaveProperty("message", "Fill in all mandatory fields")
        expect(result.body.data).toBeUndefined
    });
    test('should return 200 if a tweet is updated', async () => {
        const sut = createApp()
        // middlwware
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true)
        prismaMock.user.findUnique.mockResolvedValue(userTest)

        // router
        jest.spyOn(TwitterService.prototype, 'updateTweet').mockResolvedValue({
            ok: true,
            code: 200,
            message: "Updated tweet",
            data: {
                content: contentTest,
                dthrUpdated: new Date()
            }
        })

        // methodos
        const result = await supertest(sut).put(`/user/${idUserTest}/twitter/${idTweetTest}`).send({ content: contentTest }).set('Authorization', authorizationTokenTest)

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty("message","Updated tweet")
        expect(result.body.data).toBeDefined()
    });
    test('should return 500 if there is a failure in the tweet update process', async () => {
        const sut = createApp()
        // middlwware
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true)
        prismaMock.user.findUnique.mockResolvedValue(userTest)

        // router
        jest.spyOn(TwitterService.prototype, 'updateTweet').mockRejectedValue(any)

        // methodos
        const result = await supertest(sut).put(`/user/${idUserTest}/twitter/${idTweetTest}`).send({ content: contentTest }).set('Authorization', authorizationTokenTest)

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result.statusCode).toEqual(500)
        expect(result.body).toHaveProperty("message")
        expect(result.body.data).toBeUndefined()
    });
});

describe('test delete tweet', () => {
  test('should return 200 if a tweet is deleted', async () => {
    const sut = createApp()
        // middlwware
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true)
        prismaMock.user.findUnique.mockResolvedValue(userTest)

        // router
        jest.spyOn(TwitterService.prototype, 'deleteTweet').mockResolvedValue({
            ok: true,
            code:200,
            message: "Tweet deleted"
            
        })

        // methodos
        const result = await supertest(sut).delete(`/user/${idUserTest}/twitter/${idTweetTest}`).set('Authorization', authorizationTokenTest)

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty("message", "Tweet deleted")
        expect(result.body.data).toBeUndefined()
  });
  test('should return 500 if there is a failure in the tweet deletion process', async () => {
    const sut = createApp()
    // middlwware
    jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true)
    prismaMock.user.findUnique.mockResolvedValue(userTest)

    // router
    jest.spyOn(TwitterService.prototype, 'deleteTweet').mockRejectedValue(any)

    // methodos
    const result = await supertest(sut).delete(`/user/${idUserTest}/twitter/${idTweetTest}`).set('Authorization', authorizationTokenTest)

    // asserts
    expect(result).toBeDefined()
    expect(result.ok).toEqual(false)
    expect(result.statusCode).toEqual(500)
    expect(result.body).toHaveProperty("message")
    expect(result.body.data).toBeUndefined()
  });
})
