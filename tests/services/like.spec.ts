import { any } from 'jest-mock-extended';
import { LikeService } from '../../src/services/like.service'
import { prismaMock } from '../config/prisma.mock'
import * as dotenv from "dotenv";
dotenv.config()

describe('test like', () => {
    test('should return 200 if the user likes a tweet ', async () => {
        // sut
        const sut = new LikeService()

        prismaMock.like.create.mockResolvedValue({
            idLike: "idLike_qualquer",
            twitterId: "twitterId_qualquer",
            idUser: "idUser_qualquer",
            replyId: "replyId_qualquer",
            dthrCreated: new Date(),
            dthrUpdated: new Date(),
        })

        // methodos
        const result = await sut.likeTweet({
            idUser: "idUser_qualquer",
            twitterId: "twitterId_qualquer",
            username: "user_1"
        })

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", "user_1 liked the tweet!")
        expect(result.data).toBeDefined()
    })

    test('should return 500 if there is any failure in the like process', async () => {
        // sut
        const sut = new LikeService()
        prismaMock.like.create.mockRejectedValue(any)

        // methodos
        const result = await sut.likeTweet({
            idUser: "idUser_qualquer",
            twitterId: "twitterId_qualquer",
            username: "user_1"
        })

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 500)
        expect(result).toHaveProperty("message", "Error when liking Tweet.")
        expect(result.data).toBeDefined()
    })
})

describe('test unlike', () => {
test('should return 200 if the user unlikes a tweet  ', async () => {
     // sut
     const sut = new LikeService()

     prismaMock.like.delete.mockResolvedValue({
         idLike: "idLike_qualquer",
         twitterId: "twitterId_qualquer",
         idUser: "idUser_qualquer",
         replyId: "replyId_qualquer",
         dthrCreated: new Date(),
         dthrUpdated: new Date(),
     })

     // methodos
     const result = await sut.unLikeTweet({
         idUser: "idUser_qualquer",
         twitterId: "twitterId_qualquer",
         idLike: "idLike_qualquer",

     })

     // asserts
     expect(result).toBeDefined()
     expect(result.ok).toEqual(true)
     expect(result).toHaveProperty("code", 200)
     expect(result).toHaveProperty("message", "Like deleted! As I had already given a like previously, with this request, the like was removed.")
     expect(result.data).toBeUndefined()
})

test('should return 500 if there is any failure in the unlike process ', async() => {
   // sut
   const sut = new LikeService()
   prismaMock.like.delete.mockRejectedValue(any)

   // methodos
   const result = await sut.unLikeTweet({
       idUser: "idUser_qualquer",
       twitterId: "twitterId_qualquer",
       idLike: "idLike_qualquer",
   })

   // asserts
   expect(result).toBeDefined()
   expect(result.ok).toEqual(false)
   expect(result).toHaveProperty("code", 500)
   expect(result).toHaveProperty("message", "Error when unlike Tweet.")
   expect(result.data).toBeDefined()
})
})

describe('test like the answer', () => {
test('should return 200 if the user likes a tweet reply', async () => {
    // sut
    const sut = new LikeService()

    prismaMock.like.create.mockResolvedValue({
        idLike: "idLike_qualquer",
        twitterId: "twitterId_qualquer",
        idUser: "idUser_qualquer",
        replyId: "replyId_qualquer",
        dthrCreated: new Date(),
        dthrUpdated: new Date(),
    })

    // methodos
    const result = await sut.likeReplyTweet("idUser_qualquer","twitterId_qualquer")

    // asserts
    expect(result).toBeDefined()
    expect(result.ok).toEqual(true)
    expect(result).toHaveProperty("code", 200)
    expect(result).toHaveProperty("message", `Liked the tweet!`)
    expect(result.data).toBeDefined()
})

test('should return 500 if there is a failure in the like process on a tweet reply', async () => {
    // sut
    const sut = new LikeService()

    prismaMock.like.create.mockRejectedValue(any)

    // methodos
    const result = await sut.likeReplyTweet("idUser_qualquer","twitterId_qualquer")

    // asserts
    expect(result).toBeDefined()
    expect(result.ok).toEqual(false)
    expect(result).toHaveProperty("code", 500)
    expect(result).toHaveProperty("message", "Error when liking a tweet reply.")
    expect(result.data).toBeDefined()
})

})

describe('test unlike the answer', () => {
    test('should return 200 if the user unlikes a tweet reply', async () => {
        // sut
        const sut = new LikeService()
    
        prismaMock.like.delete.mockResolvedValue({
            idLike: "idLike_qualquer",
            twitterId: "twitterId_qualquer",
            idUser: "idUser_qualquer",
            replyId: "replyId_qualquer",
            dthrCreated: new Date(),
            dthrUpdated: new Date(),
        })
    
        // methodos
        const result = await sut.unLikeReplyTweet({
            idLike: "idLike_qualquer",
            twitterId: "twitterId_qualquer",
            idUser: "idUser_qualquer",
        })
    
        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", "Like deleted! As I had already given a like previously, with this request, the like was removed.")
        expect(result.data).toBeUndefined()
    })
    
    test('should return 500 if there is a failure in the unlike process on a tweet reply', async () => {
        // sut
        const sut = new LikeService()
    
        prismaMock.like.delete.mockRejectedValue(any)
    
        // methodos
        const result = await sut.unLikeReplyTweet({
            idLike: "idLike_qualquer",
            twitterId: "twitterId_qualquer",
            idUser: "idUser_qualquer",
        })
    
        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 500)
        expect(result).toHaveProperty("message", "Error when unliking a tweet reply.")
        expect(result.data).toBeDefined()
    })
})



