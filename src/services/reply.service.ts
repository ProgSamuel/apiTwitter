import { ReplyDTO } from "../contracts/reply.contract"
import { Result } from "../contracts/result.contract"
import repository from "../database/prisma.repository"

export class ReplyService {
    public async replyTwitter(data:ReplyDTO):Promise<Result>{
        try {
            const result = await repository.reply.create({
                data: {
                    userId: data.idUser,
                    twitterOrigin: data.idTwitter,
                    replyContent: data.content
                },
                select:{
                    replyContent: true,
                    dthrUpdated: true, 
                    likes:true
                }
            })

            return {
                ok: true,
                code:201,
                message:"Reply created successfully.",
                data:result
            }
        } catch (error:any) {
            return {
                ok: false,
                code: 500,
                message: "Error when replying to Tweet.",
                data: error.toString()
            }
        }
    }
    public async updaterReply(idTwitter:string, content:string):Promise<Result>{
        try {
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

            return {
                ok: true,
                code:200,
                message: "Updated tweet",
                data:result
            }

        } catch (error:any) {
            return {
                ok: false,
                code: 500,
                message: "Error updating Tweet reply.",
                data: error.toString()
            }
        }
    }
    public async deleteReply(idTwitter:string):Promise<Result>{
        try {
            await repository.reply.delete({
                where: {
                    idTwitter
                }
            })
            return {
                ok: true,
                code: 200,
                message: "Tweet deleted."
            }
        } catch (error:any) {
            return {
                ok: false,
                code: 500,
                message: "Error deleting Tweet reply.",
                data: error.toString()
            }
        }
    }
}