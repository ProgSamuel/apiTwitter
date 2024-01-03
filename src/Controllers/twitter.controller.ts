import { Request, Response } from "express";
import { fieldsNotProvided, notFound, serverError, successfully } from "../Utils/response.helper";
import repository from "../database/prisma.repository";
import { Twitter } from "../Models/twitter.model";

export class TwitterController {
    public async createTwitter(req: Request, res: Response) {
        try {
            // input
            const {idUser} = req.params
            const {content, type} = req.body

            !content || !type && fieldsNotProvided(res)
            const user = await repository.user.findUnique({
                where:{
                    idUser
                }
            })
            !user && notFound(res, "User")

            // processing

            const twitter = new Twitter(content, type, idUser)
            const twitterInput = twitter.toTwitterCreateInput()
            const result = await repository.twitter.create({
                data: twitterInput
            })

            //output
            return successfully(res, "Twitter", result)

        } catch (error: any) {
            return serverError(res, error)
        }
    }

}