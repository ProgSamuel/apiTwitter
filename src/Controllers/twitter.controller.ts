import { Request, Response } from "express";
import { fieldsNotProvided, notFound, serverError, successfully } from "../Utils/response.helper";
import repository from "../database/prisma.repository";
import { Twitter } from "../Models/twitter.model";
import { TwitterService } from "../services/twitter.service";


export class TwitterController {
    // CREATE TWEET
    public async createTweet(req: Request, res: Response) {
        try {
            // input
            const { idUser } = req.params
            const { content } = req.body

            !content && fieldsNotProvided(res)
            // processing 
            const twitterService = new TwitterService()
            const result = await twitterService.createTweet(content, idUser)
            res.status(result.code).send(result)

        } catch (error: any) {
            return serverError(res, error)
        }
    }

    //VIEW ALL TWEETS
    public async viewTweets(req: Request, res: Response) {
        try {
            const twitterService = new TwitterService()
            const result = await twitterService.viewTweets()
            // output 
            return res.status(result.code).send(result)
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

            const twitterService = new TwitterService()
            const result = await twitterService.tweetsUser(idUser)
            //output
            res.status(result.code).send(result)

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

            const idUserTwitter = tweet?.idUser

            if (idUser !== idUserTwitter) {
                return res.status(409).send({
                    ok: false,
                    message: "Data conflict: Tweet does not match the User id entered."
                })
            }
            //processing
            const twitterService = new TwitterService()
            const result = await twitterService.updateTweet(idTwitter, content)

            // output
            res.status(result.code).send(result)

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
            const twitterService = new TwitterService()
            const result = await twitterService.deleteTweet(idTwitter)
            // output
            res.status(result.code).send(result)

        } catch (error: any) {
            return serverError(res, error)
        }
    }
}
