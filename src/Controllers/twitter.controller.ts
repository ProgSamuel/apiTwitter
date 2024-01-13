import { Request, Response } from "express";
import { fieldsNotProvided, notFound, serverError, successfully } from "../Utils/response.helper";
import repository from "../database/prisma.repository";
import { Twitter } from "../Models/twitter.model";
import { Like } from "../Models/like.model";

export class TwitterController {
    // CREATE TT
    public async createTwitter(req: Request, res: Response) {
        try {
            // input
            const { idUser } = req.params
            const { content } = req.body

            !content && fieldsNotProvided(res)
            const user = await repository.user.findUnique({
                where: {
                    idUser
                }
            })
            !user && notFound(res, "User")

            // processing 
            const type = "normal"
            const twitter = new Twitter(content, idUser, type)
            const twitterInput = twitter.toTwitterCreateInput()
            const result = await repository.twitter.create({
                data: twitterInput
            })


            return successfully(res, "Twitter", result)

        } catch (error: any) {
            return serverError(res, error)
        }
    }

    //VIEW TWITTERS
    public async viewTwitters(req: Request, res: Response) {
        try {
            //input 
            const { idUser } = req.params

            const user = await repository.user.findUnique({
                where: {
                    idUser
                }
            })
            !user && notFound(res, "User")
            const twitters = await repository.twitter.findMany({
                select: {
                    content: true,
                    dthrUpdated: true,
                    replies: {
                        select: {
                            replyContent: true,
                            dthrUpdated: true
                        }
                    }
                },
            })

            // output 
            return res.status(200).send({
                ok: true,
                message: "Your home",
                data: twitters

            })

        } catch (error: any) {
            return serverError(res, error)
        }
    }

    // UPDATE TT
    public async updateTwitter(req: Request, res: Response) {
        try {
            // input
            const { idUser, idTwitter } = req.params
            const { content } = req.body

            const user = await repository.user.findUnique({
                where: {
                    idUser
                }
            })
            !user && notFound(res, "User")

            !content && fieldsNotProvided(res)
            const twitter = await repository.twitter.findUnique({
                where: {
                    idTwitter
                }
            })
            !twitter && notFound(res, "Twitter")

            //processing
            const idUserTwitter = twitter?.idUser

            if (idUser !== idUserTwitter) {
                return res.status(409).send({
                    ok: false,
                    message: "Data conflict: Twitter does not match the User id entered."
                })
            }


            const result = await repository.twitter.update({
                where: {
                    idTwitter
                },
                data: {
                    content,
                    dthrUpdated: new Date
                },
                select: {
                    content: true,
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

    // DELETE TT    
    public async deleteTwitter(req: Request, res: Response) {
        try {
            // input
            const { idUser, idTwitter } = req.params

            // processing
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

            const idUserTwitter = twitter?.idUser

            if (idUser !== idUserTwitter) {
                return res.status(409).send({
                    ok: false,
                    message: "Data conflict: Twitter does not match the User id entered."
                })
            }

            const result = await repository.twitter.delete({
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

    // [] like
    public async likeTwitter(req: Request, res: Response) {
        try {
            // input
            const { idUser } = req.params
            const { idTwitter } = req.body

            if (!idUser || !idTwitter) fieldsNotProvided(res)


            // processing
            const user = await repository.user.findUnique({
                where: {
                    idUser
                }
            })
            const twitter = await repository.twitter.findUnique({
                where: { idTwitter }
            })

            const receivedLike = twitter?.idUser


            const receivedLikeName = await repository.user.findUnique({
                where: {
                    idUser: receivedLike
                }
            })

            !twitter || !user && notFound(res, "Twitter or User")

            const like = new Like(idUser, idTwitter)

            const result = await repository.like.create({
                data: like
            })

            //output

            return res.status(200).send({
                ok: true,
                message: `You liked ${receivedLikeName?.name || ''}'s twitter!`,
                data: result
            })

        } catch (error: any) {
            return serverError(res, error)
        }
    }

}