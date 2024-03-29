import { createApp } from "../../src/Utils/api.helper";
import supertest from "supertest";
import { LoginService } from "../../src/services/login.service";
import { prismaMock } from "../config/prisma.mock";
import { authorizationTokenTest, exitingLikeReply, idUserTest, likeReplyTweetTest, replyTest, tweetIdTest, tweetTest, userTest } from "../../src/Utils/tests.helper";
import { LikeService } from "../../src/services/like.service";
import { any } from "jest-mock-extended";


describe('test like controller', () => {
    test('should return 404 if the user does not exist', async () => {
        const sut = createApp()
        // middlwware
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true)
        prismaMock.user.findUnique.mockResolvedValue(userTest)

        // router
        prismaMock.user.findFirst.mockResolvedValue(null)

        // methodos
        const result = await supertest(sut).post(`/user/${idUserTest}/like/${tweetIdTest}`).set('Authorization', authorizationTokenTest)

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result.statusCode).toEqual(404)
        expect(result.body).toHaveProperty("message",'User does not exist')
        expect(result.body.data).toBeUndefined()
    });
    test('should return 404 if a tweet or tweet reply does not exist', async () => {
        const sut = createApp()
        // middlwware
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true)
        prismaMock.user.findUnique.mockResolvedValue(userTest)
    
        // router
        prismaMock.user.findFirst.mockResolvedValueOnce(userTest)
        prismaMock.twitter.findUnique.mockResolvedValueOnce(null)
    
        // reply 
        prismaMock.reply.findUnique.mockResolvedValueOnce(null)
    
        // methodos
        const result = await supertest(sut).post(`/user/${idUserTest}/like/${tweetIdTest}`).set('Authorization', authorizationTokenTest)
    
        // asserts
        expect(result).toBeDefined()
        // expect(result.status).toEqual(404)
        expect(result.body).toHaveProperty("message", "Tweet does not exist")
    });
    
    test('should return 200 if the user unlikes a tweet reply', async () => {
        const sut = createApp()
        // middlwware
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true)
        prismaMock.user.findUnique.mockResolvedValue(userTest)

        // router
        prismaMock.user.findFirst.mockResolvedValue(userTest)
        prismaMock.twitter.findUnique.mockResolvedValue(tweetTest)

        prismaMock.reply.findUnique.mockResolvedValue(replyTest)
        prismaMock.like.findFirst.mockResolvedValue(exitingLikeReply)
        jest.spyOn(LikeService.prototype, 'unLikeReplyTweet').mockResolvedValue({
            ok:true,
            code:200,
            message: "Like deleted! As I had already given a like previously, with this request, the like was removed.",
        })

        // methodos
        const result = await supertest(sut).post(`/user/${idUserTest}/like/${tweetIdTest}`).set('Authorization', authorizationTokenTest)

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty("message","Like deleted! As I had already given a like previously, with this request, the like was removed.")
        expect(result.body.data).toBeUndefined()
    });
    test.skip('should return 200 if the user likes a tweet reply', async () => {
        const sut = createApp()
        // middlwware
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true)
        prismaMock.user.findUnique.mockResolvedValue(userTest)

        // router
        prismaMock.user.findFirst.mockResolvedValueOnce(userTest)
        prismaMock.twitter.findUnique.mockResolvedValueOnce(null)

        prismaMock.reply.findUnique.mockResolvedValueOnce(replyTest)
        prismaMock.like.findFirst.mockResolvedValueOnce(exitingLikeReply)
        jest.spyOn(LikeService.prototype, 'likeReplyTweet').mockResolvedValue({
            ok: true,
                code: 200,
                message: `Liked the tweet!`,
                data: {
                    idUser: idUserTest,
                    dthrUpdated: new Date(),
                    replyId: tweetTest.idTwitter,
                }
        })
        
        jest.spyOn(LikeService.prototype, 'unLikeReplyTweet').mockResolvedValue({
            ok:true,
                code:200,
                message: "Like deleted! As I had already given a like previously, with this request, the like was removed.",
        })

        // methodos
        const result = await supertest(sut).post(`/user/${idUserTest}/like/${tweetIdTest}`).set('Authorization', authorizationTokenTest)

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty("message",`Liked the tweet!`)
        expect(result.body.data).toBeUndefined()
    });
    test('should return 500 if there is a failure in the like/unlike process on a tweet', async () => {
        const sut = createApp()
        // middlwware
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true)
        prismaMock.user.findUnique.mockResolvedValue(userTest)

        // router
        prismaMock.user.findFirst.mockRejectedValue(any)

        // methodos
        const result = await supertest(sut).post(`/user/${idUserTest}/like/${tweetIdTest}`).set('Authorization', authorizationTokenTest)

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result.statusCode).toEqual(500)
        expect(result.body).toHaveProperty("message")
        expect(result.body.data).toBeUndefined()
    });
    test('should return 500 if there is a failure in the like/unlike process on a tweet reply', async () => {
        const sut = createApp()
        // middlwware
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true)
        prismaMock.user.findUnique.mockResolvedValue(userTest)

        // router
        prismaMock.user.findFirst.mockResolvedValue(userTest)
        prismaMock.twitter.findUnique.mockResolvedValue(null)

        prismaMock.reply.findUnique.mockRejectedValue(any)
        // methodos
        const result = await supertest(sut).post(`/user/${idUserTest}/like/${tweetIdTest}`).set('Authorization', authorizationTokenTest)

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result.statusCode).toEqual(500)
        expect(result.body).toHaveProperty("message")
        expect(result.body.data).toBeUndefined()
    });
    test('should return 200 if the user unlikes a tweet', async () => {
        const sut = createApp()
        // middlwware
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true)
        prismaMock.user.findUnique.mockResolvedValue(userTest)

        // router
        prismaMock.user.findFirst.mockResolvedValue(userTest)
        prismaMock.twitter.findUnique.mockResolvedValue(tweetTest)

        prismaMock.reply.findUnique.mockResolvedValue(replyTest)
        prismaMock.like.findFirst.mockResolvedValue(exitingLikeReply)
        jest.spyOn(LikeService.prototype, 'unLikeReplyTweet').mockResolvedValue({
            ok:true,
            code:200,
            message: "Like deleted! As I had already given a like previously, with this request, the like was removed.",
        })

        // methodos
        const result = await supertest(sut).post(`/user/${idUserTest}/like/${tweetIdTest}`).set('Authorization', authorizationTokenTest)

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty("message", "Like deleted! As I had already given a like previously, with this request, the like was removed.")
        expect(result.body.data).toBeUndefined()
    
    });
    test('should return 200 if the user likes a tweet', async () => {
        const sut = createApp()
        // middlwware
        jest.spyOn(LoginService.prototype, "validateLogin").mockResolvedValue(true)
        prismaMock.user.findUnique.mockResolvedValue(userTest)

        // router
        prismaMock.user.findFirst.mockResolvedValue(userTest)
        prismaMock.twitter.findUnique.mockResolvedValue(tweetTest)

        prismaMock.like.findFirst.mockResolvedValueOnce(null)
        jest.spyOn(LikeService.prototype, 'likeTweet').mockResolvedValue({
            ok:true,
                code:200,
                message: `${userTest.username} liked the tweet!`,
                data: {
                    idUser: userTest.idUser,
                    twitterId: tweetIdTest,
                    dthrUpdated: new Date,
                }
        })
        
        // methodos
        const result = await supertest(sut).post(`/user/${idUserTest}/like/${tweetIdTest}`).set('Authorization', authorizationTokenTest)

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty("message","username1 liked the tweet!")
        expect(result.body.data).toBeDefined()
        expect(result.body.data).toHaveProperty("idUser")
        expect(result.body.data).toHaveProperty("twitterId")
        expect(result.body.data).toHaveProperty("dthrUpdated")

    });
});