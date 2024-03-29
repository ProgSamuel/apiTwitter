import { Twitter } from "../Models/twitter.model"
import { Result } from "../contracts/result.contract"
import { UpdateTweetDTO } from "../contracts/tweet.contract"
import repository from "../database/prisma.repository"

export class TwitterService {
    public async createTweet(content: string, idUser: string): Promise<Result> {
        try {
            const type = "normal"
            const twitter = new Twitter(content, idUser, type)
            const twitterInput = twitter.toTwitterCreateInput()
            const result = await repository.twitter.create({
                data: twitterInput
            })
            return {
                ok: true,
                code: 200,
                message: "Tweet created successfully.",
                data: result
            }
        } catch (error: any) {
            return {
                ok: false,
                code: 500,
                message: error.toString(),
            }
        }
    }
    public async viewTweets(): Promise<Result> {
        try {
            const tweets = await repository.twitter.findMany({
                select: {
                    content: true,
                    dthrUpdated: true,
                    likes: {
                        select: {
                            idUser: true,
                            user: true,
                            idLike: true,
                        }
                    },
                    replies: {
                        select: {
                            replyContent: true,
                            dthrUpdated: true,
                            likes: {
                                select: {
                                    idUser: true,
                                    user: true,
                                    idLike: true
                                }
                            }
                        }
                    },
                    idUser: true,
                    user: true,
                    idTwitter: true,
                },
            })

            return {
                ok: true,
                code: 200,
                message: 'Your home',
                data: tweets
            }
        } catch (error: any) {
            return {
                ok: false,
                code: 500,
                message: error.toString(),
            }
        }
    }
    public async tweetsUser(idUser: string): Promise<Result> {
        try {
            const user = await repository.user.findUnique({
                where: {
                    idUser
                }
            })
            if (!user) return {
                ok: false,
                code:404,
                message: "User does not exist"
            }
            const tweets = await repository.twitter.findMany({
                where: {
                    idUser
                },
                select: {
                    content: true,
                    idTwitter: true,
                    dthrUpdated: true,
                    idUser: true,
                    likes: true,
                    user: true,
                    replies: true,
                }
            })
            return {
                ok: true,
                code: 200,
                message: `You has ${tweets.length} tweets`,
                data: tweets
            }
        } catch (error: any) {
            return {
                ok: false,
                code: 500,
                message: error.toString(),
            }
        }
    }
    public async updateTweet(data:UpdateTweetDTO): Promise<Result> {
        try {
            const tweet = await repository.twitter.findUnique({
                where: {
                    idTwitter: data.idTwitter
                }
            })
            if (!tweet) {
                return {
                    ok: false,
                    code: 404,
                    message: "Tweet does not exist",
                }
            }

            const idUserTwitter = tweet?.idUser

            if (data.idUser !== idUserTwitter) {
                return {
                    ok: false,
                    code: 409,
                    message: "Data conflict: Tweet does not match the User id entered."
                }
            }

            const result = await repository.twitter.update({
                where: {
                    idTwitter:data.idTwitter
                },
                data: {
                    content:data.content,
                    dthrUpdated: new Date
                },
                select: {
                    content: true,
                    dthrUpdated: true
                }
            })

            return {
                ok: true,
                code:200,
                message: "Updated tweet",
                data: result
            }
        } catch (error: any) {
            return {
                ok: false,
                code: 500,
                message: error.toString(),
            }
        }
    }
    public async deleteTweet(idTwitter:string, idUser:string): Promise<Result> {
        try {
            const tweet = await repository.twitter.findUnique({
                where: {
                    idTwitter
                }
            })
            if (!tweet) {
                return {
                    ok: false,
                    code: 404,
                    message: "Tweet does not exist."
                }
            }

            const idUserTwitter = tweet?.idUser
            if (idUser !== idUserTwitter) {
                return {
                    ok: false,
                    code:409,
                    message: "Data conflict: Tweet does not match the User id entered."
                }
            }
            await repository.twitter.delete({
                where: {
                    idTwitter
                }
            })
            return {
                ok: true,
                code:200,
                message: "Tweet deleted"
            }
        } catch (error: any) {
            return {
                ok: false,
                code: 500,
                message: error.toString(),
            }
        }
    }
}