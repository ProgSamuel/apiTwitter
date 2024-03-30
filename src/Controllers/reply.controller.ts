import { Request, Response } from "express"
import { fieldsNotProvided, notFound, serverError } from "../Utils/response.helper"
import repository from "../database/prisma.repository"
import { ReplyService } from "../services/reply.service"

export class ReplyController {
      // CREATE REPLY
      public async replyTwitter(req:Request, res: Response) {
        try {
            // input
            const { idUser, idTwitter } = req.params
            const { content } = req.body

            !content && fieldsNotProvided(res)
            const twitter = await repository.twitter.findUnique({
                where: {
                    idTwitter
                }
            })
            !twitter && notFound(res, "Tweet")

            // processing
            const replyService = new ReplyService()
            const result = await replyService.replyTwitter({idUser, idTwitter, content})
            res.status(result.code).send(result)
        } catch (error: any) {
            return serverError(res, error)
        }
    }

    // UPDATE REPLY
    public async updaterReply(req: Request, res: Response) {
        try {
            // input
            const { idUser, idTwitter } = req.params
            const { content } = req.body

            !content && fieldsNotProvided(res)
            const twitter = await repository.reply.findUnique({
                where: {
                    idTwitter
                }
            })
            !twitter && notFound(res, "Tweet")

            const idUserTwitter = twitter?.userId

            if (idUser !== idUserTwitter) {
                return res.status(409).send({
                    ok: false,
                    message: "Data conflict: Tweet does not match the User id entered."
                })
            }
            //processing
            const replyService = new ReplyService()

            const result = await replyService.updaterReply(idTwitter, content)

            // output

            res.status(result.code).send(result)

        } catch (error: any) {
            return serverError(res, error)
        }
    }

    // DELETE REPLY
    public async deleteReply(req: Request, res: Response) {
        try {
            // input
            const { idUser, idTwitter } = req.params

            // processing

            const twitter = await repository.reply.findUnique({
                where: {
                    idTwitter
                }
            })
            !twitter && notFound(res, "Tweet")

            const idUserTwitter = twitter?.userId

            if (idUser !== idUserTwitter) {
                return res.status(409).send({
                    ok: false,
                    message: "Data conflict: Tweet does not match the User id entered."
                })
            }

            const replyService = new ReplyService()
            const result = await replyService.deleteReply(idTwitter)
            return res.status(result.code).send(result)
            // output

        } catch (error: any) {
            return serverError(res, error)
        }
    }
}