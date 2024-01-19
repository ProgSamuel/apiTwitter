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
            const twitter = await repository.twitter.findUnique({
                where: {
                    idTwitter
                }
            })
            !twitter && notFound(res, "Tweet")

            // processing 

            const type = "reply"
            new Reply(idUser, idTwitter, content, type)
            const result = await repository.reply.create({
                data: {
                    userId: idUser,
                    twitterOrigin: idTwitter,
                    replyContent: content
                },
                select:{
                    replyContent: true,
                    dthrUpdated: true, 
                    likes:true
                }
            })


            return successfully(res, "Reply", result)

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

            //processing
            const idUserTwitter = twitter?.userId

            if (idUser !== idUserTwitter) {
                return res.status(409).send({
                    ok: false,
                    message: "Data conflict: Tweet does not match the User id entered."
                })
            }

            const result = await repository.reply.update({
                where: {
                    idTwitter
                },
                data: {
                    replyContent:content,
                    dthrUpdated: new Date
                },
                select: {
                    replyContent: true,
                    dthrUpdated: true
                }
            })

            // output

            res.status(200).send({
                ok: true,
                message: "Updated twitter",
                data: {
                    result
                }
            })

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

            await repository.reply.delete({
                where: {
                    idTwitter
                }
            })

            return res.status(200).send({
                ok: true,
                message: "Twitter deleted"
            })

            // output

        } catch (error: any) {
            return serverError(res, error)
        }
    }
}