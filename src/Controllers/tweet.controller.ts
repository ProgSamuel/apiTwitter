import { Request, Response } from "express";
import { fieldsNotProvided, serverError } from "../Utils/response.helper";
import { TwitterService } from "../services/tweet.service";


export class TwitterController {
    // CREATE TWEET
    public async createTweet(req: Request, res: Response) {
        try {
            // input
            const { idUser } = req.params
            const { content } = req.body

            if (!content) {
                return fieldsNotProvided(res)
            }
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

            if (!content) return fieldsNotProvided(res)

            //processing
            const twitterService = new TwitterService()
            const result = await twitterService.updateTweet({idTwitter, content, idUser})

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
            const twitterService = new TwitterService()
            const result = await twitterService.deleteTweet(idTwitter, idUser)
            // output
            res.status(result.code).send(result)

        } catch (error: any) {
            return serverError(res, error)
        }
    }
}
