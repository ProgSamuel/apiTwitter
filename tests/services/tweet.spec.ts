import { any } from 'jest-mock-extended';
import { TwitterService } from '../../src/services/tweet.service'
import { prismaMock } from '../config/prisma.mock'
import * as dotenv from "dotenv";
dotenv.config();

describe('test create tweet', () => {
    test('should return 200 if the user creates a tweet', async () => {
        const sut = new TwitterService()
        prismaMock.twitter.create.mockResolvedValue({
            idUser: "id_qualquer",
            content: "reply_qualquer",
            dthrCreated: new Date(),
            dthrUpdated: new Date(),
            idTwitter: "idTwitter_qualquer",
            type: "normal",
        })
        const result = await sut.createTweet("content", "id_qualquer")

        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", "Tweet created successfully.")

        expect(result.data).toBeDefined()
        expect(result.data).toHaveProperty("idTwitter")
        expect(result.data).toHaveProperty("content")
        expect(result.data).toHaveProperty("type")
        expect(result.data).toHaveProperty("dthrCreated")
        expect(result.data).toHaveProperty("dthrUpdated")
        expect(result.data).toHaveProperty("idUser")
    })
    test('should return 500 if there is any failure in the process of creating a tweet', async () => {
        const sut = new TwitterService()
        prismaMock.twitter.create.mockRejectedValue(any)
        const result = await sut.createTweet("content", "id_qualquer")
        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 500)
        expect(result).toHaveProperty("message")

        expect(result.data).toBeUndefined()
    })

})

describe('test view  all tweets', () => {
    test('should return 200 if the user can view all tweets', async () => {
        const sut = new TwitterService()
        prismaMock.twitter.findMany.mockResolvedValue([{
            idUser: "id_qualquer",
            content: "reply_qualquer",
            dthrCreated: new Date(),
            dthrUpdated: new Date(),
            idTwitter: "idTwitter_qualquer",
            type: "normal",
        }])
        const result = await sut.viewTweets()
        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", 'Your home')

        expect(result.data).toBeDefined()
    })
    test('should return 500 if there is any failure in the tweet viewing process', async () => {
        const sut = new TwitterService()
        prismaMock.twitter.findMany.mockRejectedValue(any)
        const result = await sut.viewTweets()

        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 500)
        expect(result).toHaveProperty("message")

        expect(result.data).toBeUndefined()
    })
})

describe('test tweets of user', () => {
    test('should return 404 if the user does not exist', async () => {
        const sut = new TwitterService()
        prismaMock.user.findUnique.mockReturnValue(null!)

        const result = await sut.tweetsUser("id")

        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", "User does not exist")
        expect(result.data).toBeUndefined()
    })

    test('should return 200 if the user accesses your tweets ', async () => {
        const sut = new TwitterService()
        prismaMock.user.findUnique.mockResolvedValue({
            idUser: "idUser_qualquer",
            email: "email_qualquer",
            dthrCreated: new Date(),
            dthrUpdated: new Date(),
            name: "name_qualquer",
            password: "password_qualquer",
            photo: null,
            token: "token_qualquer",
            username: "username_qualquer"
        })
        prismaMock.twitter.findMany.mockResolvedValue([
            {
                idUser: "id_qualquer",
                content: "reply_qualquer",
                dthrCreated: new Date(),
                dthrUpdated: new Date(),
                idTwitter: "idTwitter_qualquer",
                type: "normal"
            }
        ])
        const result = await sut.tweetsUser("idUser_qualquer")

        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message")
        expect(result.message).toContain("You has")

        expect(result.data).toBeDefined()
    })

    test("should return 500 if there is a failure in the user's tweet viewing process", async () => {
        const sut = new TwitterService()
        prismaMock.user.findUnique.mockRejectedValue(any)
        const result = await sut.tweetsUser("id")

        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 500)
        expect(result).toHaveProperty("message")
        expect(result.data).toBeUndefined()
    })

})

describe('test update user', () => {
    test('should return 404 if tweet does not exist', async () => {
        const sut = new TwitterService()
        prismaMock.twitter.findUnique.mockReturnValue(null!)
        const result = await sut.updateTweet({
            idTwitter: "idTwitter_qualquer",
            idUser: "id_qualquer",
            content: "reply_qualquer",
        })
        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", "Tweet does not exist")
        expect(result.data).toBeUndefined()
    })

    test('should return 409 if there is data conflict', async () => {
        const sut = new TwitterService()
        prismaMock.twitter.findUnique.mockResolvedValue({
            idUser: "id_qualquer",
            content: "reply_qualquer",
            dthrCreated: new Date(),
            dthrUpdated: new Date(),
            idTwitter: "idTwitter_qualquer",
            type: "normal",
        })
        const result = await sut.updateTweet({
            idTwitter: "idTwitter_qualquer",
            idUser: "id_qualquer_test",
            content: "reply_qualquer",
        })
        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 409)
        expect(result).toHaveProperty("message", "Data conflict: Tweet does not match the User id entered.")
        expect(result.data).toBeUndefined()
    })

    test('should return 200 if the tweet is updated', async () => {
        const sut = new TwitterService()
        prismaMock.twitter.findUnique.mockResolvedValue({
            idUser: "id_qualquer",
            content: "reply_qualquer",
            dthrCreated: new Date(),
            dthrUpdated: new Date(),
            idTwitter: "idTwitter_qualquer",
            type: "normal",
        })
        const result = await sut.updateTweet({
            idTwitter: "idTwitter_qualquer",
            idUser: "id_qualquer",
            content: "reply_qualquer",
        })
        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", "Updated tweet")
        expect(result).toHaveProperty("data")
        
    })

    test('should return 500 if there is an unhandled failure', async () => {
        const sut = new TwitterService()
        prismaMock.twitter.findUnique.mockRejectedValue(any)
        const result = await sut.updateTweet({
            idTwitter: "idTwitter_qualquer",
            idUser: "id_qualquer",
            content: "reply_qualquer",
        })
        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 500)
        expect(result).toHaveProperty("message")
        expect(result.data).toBeUndefined()
    })
})
describe('test delete tweet', () => {
  test('should return 404 if tweet does not exist', async () => {
    const sut = new TwitterService()
        prismaMock.twitter.findUnique.mockReturnValue(null!)
        const result = await sut.deleteTweet("idTwitter_qualquer","id_qualquer" )
        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", "Tweet does not exist.")
        expect(result.data).toBeUndefined()
  })
  test('should return 409 if the user tries to delete a tweet that is not theirs', async () => {
    const sut = new TwitterService()
        prismaMock.twitter.findUnique.mockResolvedValue({
            idUser: "id_qualquer",
            content: "reply_qualquer",
            dthrCreated: new Date(),
            dthrUpdated: new Date(),
            idTwitter: "idTwitter_qualquer",
            type: "normal",
        })
        const result = await sut.deleteTweet("idTwitter_qualquer","id_qualquer1" )

        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 409)
        expect(result).toHaveProperty("message", "Data conflict: Tweet does not match the User id entered.")
        expect(result.data).toBeUndefined()
  })
  test('should return 200 if the user deletes a tweet', async () => {
    const sut = new TwitterService()
        prismaMock.twitter.findUnique.mockResolvedValue({
            idUser: "id_qualquer",
            content: "reply_qualquer",
            dthrCreated: new Date(),
            dthrUpdated: new Date(),
            idTwitter: "idTwitter_qualquer",
            type: "normal",
        })
        const result = await sut.deleteTweet("idTwitter_qualquer","id_qualquer" )

        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", "Tweet deleted")
        expect(result.data).toBeUndefined()
  })
  test("should return 500 if there is a failure in the user's tweet viewing process",async() => {
    const sut = new TwitterService()
        prismaMock.twitter.findUnique.mockRejectedValue(any)
        const result = await sut.deleteTweet("idTwitter_qualquer","id_qualquer" )

        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 500)
        expect(result).toHaveProperty("message")
        expect(result.data).toBeUndefined()
  })
  
})
