import { Result } from "../contracts/result.contract";
import repository from "../database/prisma.repository";

export class LikeService {
    public async likeTweet (idUser:string, twitterId:string, username:string) :Promise<Result>{
        try {
            const result = await repository.like.create({
                data: {
                    idUser,
                    twitterId,
                },
                select: {
                    idUser: true,
                    twitterId: true,
                    dthrUpdated: true
                }
            });
            return {
                ok:true,
                code:200,
                message: `${username} liked the tweet!`,
                data: result
            }
        } catch (error:any) {
            return {
                ok: false,
                code: 500,
                message: "Error when liking Tweet.",
                data: error.toString()
            }
        }
    }
    public async unLikeTweet(idUser:string, twitterId:string, idLike:string):Promise <Result>{
        try {
            await repository.like.delete({
                where: {
                    idUser,
                    twitterId,
                    idLike,
                }
            })
            return {
                ok:true,
                code:200,
                message: "Like deleted! As I had already given a like previously, with this request, the like was removed.",
            }
        } catch (error:any) {
            return {
                ok: false,
                code: 500,
                message: "Error when unlike Tweet.",
                data: error.toString()
            }
        }
    }
    public async likeReplyTweet(idUser:string, twitterId:string):Promise<Result>{
        try {
            const result = await repository.like.create({
                data: {
                    idUser,
                    replyId: twitterId,
                },
                select:{
                    idUser:true,
                    replyId:true,
                    dthrUpdated:true
                }
            })

            return {
                ok: true,
                code: 200,
                message: `Liked the tweet!`,
                data: result
            }
        }catch (error:any) {
            return {
                ok: false,
                code: 500,
                message: "Error when liking a tweet reply.",
                data: error.toString()
            }
        }
    }
    public async unLikeReplyTweet(idUser:string, twitterId:string, idLike:string):Promise<Result>{
        try {
            await repository.like.delete({
                where: {
                    idUser,
                    replyId: twitterId,
                    idLike,
                }
            })
            return {
                ok:true,
                code:200,
                message: "Like deleted! As I had already given a like previously, with this request, the like was removed.",

            }
        }catch (error:any) {
            return {
                ok: false,
                code: 500,
                message: "Error when unliking a tweet reply.",
                data: error.toString()
            }
        }
    }
}