import { Request, Response } from "express";
import { notFound, serverError } from "../Utils/response.helper";
import repository from "../database/prisma.repository";
import { FollowService } from "../services/follow.service";

export class FollowController {
    // FOLLOW and UNFOLLOW
    public async follow(req: Request, res: Response) {
        try {
            // input
            const { idUser, idFollow } = req.params

            if (idUser === idFollow) {
                return res.status(400).send({
                    ok: false,
                    message: "User cannot follow themselves"
                })
            }

            const user = await repository.user.findFirst({
                where: { idUser }, select: { username: true, idUser: true, following: true }
            })

            if (!user) {
                return notFound(res, 'User');
            }

            const follow = await repository.user.findFirst({
                where: {
                    idUser: idFollow
                }, select: { username: true, idUser: true, following: true }
            })

            if (!follow) {
                return notFound(res, 'Followed');
            }

            const existing = await repository.followers.findFirst({
                where: {
                    idUser,
                    idFollowing: idFollow
                }
            })

            // processing
            const followService = new FollowService()

            if (existing) {
                const result = await followService.unfollow({
                        idFollow,
                        idUser,
                        user,
                        userFollow: follow,
                        existingId: existing.id
                })
                return res.status(result.code).send(result)
            }

            const result =  await followService.follow({
                idUser, 
                idFollow, 
                user, 
                userFollow: follow
            })

            // output
            return res.status(result.code).send(result)
        } catch (error: any) {
            return serverError(res, error);
        }
    }
}