import { Request, Response } from "express";
import { fieldsNotProvided, notFound, serverError, successfully } from "../Utils/response.helper";
import repository from "../database/prisma.repository";
import { Twitter } from "../Models/twitter.model";


export class TwitterController {
    // CREATE TWEET
    public async createTweet(req: Request, res: Response) {
        try {
            // input
            const { idUser } = req.params 
            const { content } = req.body

            !content && fieldsNotProvided(res)
            

            // processing 
            const type = "normal"
            const twitter = new Twitter(content, idUser, type)
            const twitterInput = twitter.toTwitterCreateInput()
            const result = await repository.twitter.create({
                data: twitterInput
            })


            return successfully(res, "Tweet", result)

        } catch (error: any) {
            return serverError(res, error)
        }
    }

    //VIEW ALL TWEETS
    public async viewTweets(req: Request, res: Response) {
        try {

            const tweets = await repository.twitter.findMany({
                select: {
                    content: true,
                    dthrUpdated: true,
                    likes: {
                        select: {
                            idUser: true,
                            user:true,
                            idLike:true,
                        }
                    },
                    replies: {
                        select: {
                            replyContent: true,
                            dthrUpdated: true,
                            likes: {
                                select: {
                                    idUser: true,
                                    user:true,
                                    idLike:true
                                }
                            }
                        }
                    },
                    idUser:true,
                    user:true,
                    idTwitter:true,
                    

                },
            })

            // output 
            return res.status(200).send({
                ok: true,
                message: "Your home",
                data: tweets

            })

        } catch (error: any) {
            return serverError(res, error)
        }
    }

    // VIEW USER TWEETS
    public async tweetsUser(req: Request, res: Response) {
        try {
            // input 
            const { idUser } = req.params
            const user = await repository.user.findUnique({
                where: {
                    idUser
                }
            })
            !user && notFound(res, "User")

            const twitters = await repository.twitter.findMany({
                where:{
                    idUser
                },
                select:{
                    content:true,
                    idTwitter:true,
                    dthrUpdated:true,
                    idUser:true,
                    likes:true,
                    user:true,
                    replies:true,
                }
            })

            //output

            res.status(200).send({
                ok:true,
                message:`${user?.username} has ${twitters.length} tweets`,
                data: twitters
            })

        } catch (error: any) {
            return serverError(res, error)
        }
    }

    // UPDATE TWEET
    public async updateTweet(req: Request, res: Response) {
        try {
            // input
            const { idUser, idTwitter } = req.params
            const { content } = req.body

            !content && fieldsNotProvided(res)
            const tweet = await repository.twitter.findUnique({
                where: {
                    idTwitter
                }
            })
            !tweet && notFound(res, "Tweet")

            //processing
            const idUserTwitter = tweet?.idUser

            if (idUser !== idUserTwitter) {
                return res.status(409).send({
                    ok: false,
                    message: "Data conflict: Tweet does not match the User id entered."
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
                message: "Updated tweet",
                data: {
                    result
                }
            })

        } catch (error: any) {
            return serverError(res, error)
        }
    }

    // DELETE TWEET    
    public async deleteTweet(req: Request, res: Response) {
        try {
            // input
            const { idUser, idTwitter } = req.params

            // processing

            const tweet = await repository.twitter.findUnique({
                where: {
                    idTwitter
                }
            })
            !tweet && notFound(res, "Tweet")

            const idUserTwitter = tweet?.idUser

            if (idUser !== idUserTwitter) {
                return res.status(409).send({
                    ok: false,
                    message: "Data conflict: Tweet does not match the User id entered."
                })
            }

            const result = await repository.twitter.delete({
                where: {
                    idTwitter
                }
            })

            return res.status(200).send({
                ok: true,
                message: "Tweet deleted"
            })

            // output

        } catch (error: any) {
            return serverError(res, error)
        }
    }
}
