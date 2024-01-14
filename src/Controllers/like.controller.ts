import { Request, Response } from "express";
import repository from "../database/prisma.repository";
import { notFound, serverError } from "../Utils/response.helper";
import { error } from "console";

export class LikeController {
    // CREATE LIKE
    public async likeTwitter(req: Request, res: Response) {
        try {
            // input
            const { idUser, twitterId } = req.params;

            const twitter = await repository.twitter.findUnique({
                where: { idTwitter: twitterId }
            })

            if (!twitter) {
                try {
                    const reply = await repository.reply.findUnique({
                        where: { idTwitter: twitterId }
                    })

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

                    if (existingLike) {
                        await repository.like.delete({
                            where: {
                                idUser,
                                replyId: twitterId,
                                idLike: existingLike.idLike
                            }
                        })
                        return res.status(200).json({
                            ok: true,
                            message: "Like deleted! As I had already given a like previously, with this request, the like was removed.",
                        });
                    }

                    const likeReply = await repository.like.create({
                        data: {
                            idUser,
                            replyId: twitterId
                        }
                    })

                    return res.status(200).send({
                        ok: true,
                        message: `You liked the tweet!`,
                        data:likeReply
                    });

                } catch (error) { return serverError(res, error) }
            }


            // processing
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

            if (existingLike) {
                await repository.like.delete({
                    where: {
                        idUser,
                        twitterId,
                        idLike: existingLike.idLike
                    }
                })
                return res.status(200).json({
                    ok: true,
                    message: "Like deleted! As I had already given a like previously, with this request, the like was removed.",
                });
            }

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


            // output
            return res.status(200).send({
                ok: true,
                message: `You liked the tweet!`,
                data: result,
            });


        } catch (error: any) {
            return serverError(res, error);
        }
    }
}