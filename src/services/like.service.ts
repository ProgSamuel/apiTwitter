import { LikeDTO, UnLikeDTO, UnLikeReplyDTO } from "../contracts/like.contract";
import { Result } from "../contracts/result.contract";
import repository from "../database/prisma.repository";

export class LikeService {
    public async likeTweet (data:LikeDTO) :Promise<Result>{
        try {
            const result = await repository.like.create({
                data: {
                    idUser:data.idUser,
                    twitterId:data.twitterId,
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
                message: `${data.username} liked the tweet!`,
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
    public async unLikeTweet(data:UnLikeDTO):Promise <Result>{
        try {
            await repository.like.delete({
                where: {
                    idUser:data.idUser,
                    twitterId:data.twitterId,
                    idLike:data.idLike!,
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
    public async unLikeReplyTweet(data:UnLikeReplyDTO):Promise<Result>{
        try {
            await repository.like.delete({
                where: {
                    idUser:data.idUser,
                    replyId: data.twitterId,
                    idLike:data.idLike,
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