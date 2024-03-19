import { randomUUID } from "crypto";
import { Result } from "../contracts/result.contract";
import repository from "../database/prisma.repository";
import { DataFollowDTO } from "../contracts/follow.contract";

export class FollowService {
    public async follow (data: DataFollowDTO):Promise <Result> {
        try {
            await repository.followers.create({
                data: {
                    id: randomUUID(),
                    idUser : data.idUser,
                    idFollowing: data.idFollow
                }
            })
    
            return {
                ok: true,
                code: 201,
                message: `${data.user?.username} started following ${data.userFollow?.username}`
            }
        } catch (error:any) {
            return {
                ok: false,
                code: 500,
                message: "Error when following the user.",
                data: error.toString()
            }
        }
    }
    public async unfollow(data: DataFollowDTO): Promise<Result>{
        try {
            await repository.followers.delete({ where: { 
                id: data.existingId, 
                idUser:data.idUser, 
                idFollowing: data.idFollow 
            } })

            return {
                ok: true,
                code: 201,
                message: `${data.user?.username} unfollowed ${data.userFollow?.username}`
            }
      
        } catch (error:any) {
            return {
                ok: false,
                code: 500,
                message: "Error when unfollowing the user.",
                data: error.toString()
            }
        }
    }
}