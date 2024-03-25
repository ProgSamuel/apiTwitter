import { any } from 'jest-mock-extended';
import {ReplyService} from '../../src/services/reply.service'
import { prismaMock } from '../config/prisma.mock'
import * as dotenv from "dotenv";
dotenv.config();

describe('test replyTwitter', () => {
  test('should return 201 if the user responds to a tweet ', async () => {
    const sut = new ReplyService()

    prismaMock.reply.create.mockResolvedValue({
            userId:"id_qualquer",
            twitterOrigin:"tweet_qualquer",
            replyContent:"reply_qualquer",
            dthrCreated: new Date(),
            dthrUpdated: new Date(),
            idTwitter:"id_qualquer",
        
    })

    const result = await sut.replyTwitter({
        idUser: "id_qualquer",
        content:"content",
        idTwitter: "id_qualquer"
    })

    expect(result).toBeDefined()
    expect(result.ok).toEqual(true)
    expect(result).toHaveProperty("code", 201)
    expect(result).toHaveProperty("message", "Reply created successfully.")

    expect(result.data).toBeDefined()
    expect(result.data).toHaveProperty("replyContent")
    expect(result.data).toHaveProperty("dthrUpdated")
  })

  test('should return 500 if there is any failure in the process of replying to a tweet ', async () => {
    const sut = new ReplyService()

    prismaMock.reply.create.mockRejectedValue(any)

    const result = await sut.replyTwitter({
        idUser: "id_qualquer",
        content:"content",
        idTwitter: "id_qualquer"
    })

    expect(result).toBeDefined()
    expect(result.ok).toEqual(false)
    expect(result).toHaveProperty("code", 500)
    expect(result).toHaveProperty("message", "Error when replying to Tweet.")
    expect(result).toHaveProperty("data")  
  })
})

describe('test updaterReply ', () => {
  test('should return 200 if the user updates a tweet reply',async () => {
    const sut = new ReplyService()
    prismaMock.reply.update.mockResolvedValue({
      userId:"id_qualquer",
      twitterOrigin:"tweet_qualquer",
      replyContent:"reply_qualquer",
      dthrCreated: new Date(),
      dthrUpdated: new Date(),
      idTwitter:"id_qualquer",
    })

    const result = await sut.updaterReply("id_qualquer","reply_qualquer")

    expect(result).toBeDefined()
    expect(result.ok).toEqual(true)
    expect(result).toHaveProperty("code", 200)
    expect(result).toHaveProperty("message", "Updated tweet")

    expect(result.data).toBeDefined()
    expect(result.data).toHaveProperty("replyContent")
    expect(result.data).toHaveProperty("dthrUpdated")
  })

  test('should return 500 if there is a failure in the process of updating a tweet reply', async () => {
    const sut = new ReplyService()
    prismaMock.reply.update.mockRejectedValue(any)
    const result = await sut.updaterReply("id_qualquer","reply_qualquer")
    expect(result).toBeDefined()
    expect(result.ok).toEqual(false)
    expect(result).toHaveProperty("code", 500)
    expect(result).toHaveProperty("message", "Error updating Tweet reply.")
    expect(result).toHaveProperty("data")
  })
})

describe('test deleteReply', () => {
  test('should return 200 if the user deletes a tweet reply', async () => {
    const sut = new ReplyService()
    prismaMock.reply.delete.mockResolvedValue({
        userId:"id_qualquer",
        twitterOrigin:"tweet_qualquer",
        replyContent:"reply_qualquer",
        dthrCreated: new Date(),
        dthrUpdated: new Date(),
        idTwitter:"id_qualquer",
      })
      const result = await sut.deleteReply("id_qualquer")

      expect(result).toBeDefined()
      expect(result.ok).toEqual(true)
      expect(result).toHaveProperty("code", 200)
      expect(result).toHaveProperty("message", "Tweet deleted.")
      expect(result.data).toBeUndefined()
  })

  test('should return 500 if there is any failure in the process of deleting a tweet reply',async () => {
    const sut = new ReplyService()
    prismaMock.reply.delete.mockRejectedValue(any)
    const result = await sut.deleteReply("id_qualquer")
    expect(result).toBeDefined()
    expect(result.ok).toEqual(false)
    expect(result).toHaveProperty("code", 500)
    expect(result).toHaveProperty("message", "Error deleting Tweet reply.")
    expect(result).toHaveProperty("data")
  })
})


