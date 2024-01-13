import { Request, Response } from "express"
import { fieldsNotProvided, notFound, serverError, successfully } from "../Utils/response.helper"
import repository from "../database/prisma.repository"
import { Reply } from "../Models/reply.model"

export class ReplyController {
      // CREATE REPLY
      public async replyTwitter(req:Request, res: Response) {
        try {
            // input
            const { idUser, idTwitter } = req.params
            const { content } = req.body

            !content && fieldsNotProvided(res)
            const user = await repository.user.findUnique({
                where: {
                    idUser
                }
            })
            !user && notFound(res, "User")
            const twitter = await repository.twitter.findUnique({
                where: {
                    idTwitter
                }
            })
            !twitter && notFound(res, "Twitter")

            // processing 

            const type = "reply"
            const reply = new Reply(idUser, idTwitter, content, type)
            const result = await repository.reply.create({
                data: {
                    idTwitter,
                    userId: idUser,
                    twitterOrigin: idTwitter,
                    replyContent: content
                },
                select:{
                    replyContent: true,
                    dthrUpdated: true
                }
            })


            return successfully(res, "Reply", result)

        } catch (error: any) {
            return serverError(res, error)
        }
    }
}