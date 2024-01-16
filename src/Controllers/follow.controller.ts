import { Request, Response } from "express";
import { notFound, serverError } from "../Utils/response.helper";
import repository from "../database/prisma.repository";
import { randomUUID } from "crypto";

export class FollowController {
    // FOLLOW and UNFOLLOW
    public async follow(req: Request, res: Response) {
        try {
            // input
            const { idUser, idFollow } = req.params

            const user = await repository.user.findFirst({
                where: { idUser }, select: { username: true, idUser: true, following: true }
            })

            const follow = await repository.user.findFirst({
                where: {
                    idUser: idFollow
                }
            })

            !follow || !user && notFound(res, 'User')

            idUser === idFollow && res.status(400).send({
                ok: false,
                message: "User cannot follow themselves"
            })

            const existing = await repository.followers.findFirst({
                where: {
                    idUser,
                    idFollowing: idFollow
                }
            })

            if (existing) {
                await repository.followers.delete({ where: { id: existing.id, idUser, idFollowing: idFollow } })
                return res.status(201).send({
                    ok: true,
                    message: `${user?.username} unfollowed ${follow?.username}`
                })
            }

            // processing
            const result = await repository.followers.create({
                data: {
                    id: randomUUID(),
                    idUser,
                    idFollowing: idFollow
                }
            })
            return res.status(201).send({
                ok: true,
                message: `${user?.username} started follwing ${follow?.username}`
            })

            // output

        } catch (error: any) {
            return serverError(res, error);
        }
    }
}