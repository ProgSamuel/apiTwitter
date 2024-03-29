import { Request, Response } from "express";
import repository from "../database/prisma.repository";
import { notFound, serverError } from "../Utils/response.helper";
import { LikeService } from "../services/like.service";


export class LikeController {
    // CREATE LIKE AND DESLIKE 
    public async likeTwitter(req: Request, res: Response) {
        try {
            // input
            const { idUser, twitterId } = req.params;

            const user = await repository.user.findFirst({
                where: { idUser }, select: { username: true, idUser: true, following: true }
            })

            if (!user) {
                return notFound(res, "User")
            }

            const twitter = await repository.twitter.findUnique({
                where: { idTwitter: twitterId }
            })

            if (!twitter) {
                // reply 
                const reply = await repository.reply.findUnique({
                    where: { idTwitter: twitterId }
                })
                if (!reply) {
                      return res.status(404).send({
                        ok: false,
                        message: `Tweet does not exist`,
                    })
                } else {
                    const existingLike = await repository.like.findFirst({
                        where: {
                            idUser,
                            replyId: twitterId,
                        }, select: {
                            idLike: true,
                            idUser: true,
                            replyId: true,
                        }
                    });
                    
                    const likeService = new LikeService()
        
                    if (existingLike) {
                        const result = await likeService.unLikeReplyTweet({
                            idUser, 
                            twitterId,
                            idLike: existingLike.idLike
                        })
                        return res.status(result.code).send(result)
                    }
                    const result = await likeService.likeReplyTweet(idUser, twitterId)
                    return res.status(result.code).send(result)
                }
                
            }
            

            const existingLike = await repository.like.findFirst({
                where: {
                    idUser,
                    twitterId,
                }, select: {
                    idLike: true,
                    idUser: true,
                    twitterId: true,
                }
            });
            // processing
            const likeService = new LikeService()

            if (existingLike) {
              const result = await likeService.unLikeTweet({idUser, twitterId, idLike: existingLike.idLike})
                return res.status(result.code).send(result)
            }

            const result =  await likeService.likeTweet({idUser, twitterId, username:user?.username!})            
            // output
            res.status(result.code).send(result)

        } catch (error: any) {
            return serverError(res, error);
        }
    }
}
