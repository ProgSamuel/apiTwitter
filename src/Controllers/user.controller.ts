import { Request, Response } from "express";
import repository from "../database/prisma.repository";
import { User } from "../Models/user.model";
import { existing, fieldsNotProvided, invalidData, notFound, serverError, successfully } from "../Utils/response.helper";
import { randomUUID } from "crypto";

export class UserController {
    // login
    public async login(req: Request, res: Response) {
        try {
            // input 
            // need idUser - email || username - password
            const { email, username, password } = req.body
            if (!email && !username || !password) return fieldsNotProvided(res);

            // processing
            const checkEmail = await repository.user.findFirstOrThrow({
                where: { email },
            })
            const checkUsername = await repository.user.findFirstOrThrow({
                where: { username },
            })

            if (!checkEmail && !checkUsername) return notFound(res, "Email o username")

            const user = await repository.user.findFirst({
                where: { email, username },
                //  select:{
                //     twitters:true,
                //     password:true,
                //     idUser:true,
                //     username:true,
                //     token:true,
                //     name:true,
                //     photo:true,
                //     following:true,
                // }
            })


            user?.password !== password && invalidData(res)
            const token: string = randomUUID();

            await repository.user.update({
                where: { idUser: user?.idUser },
                data: { token },
            })

            const tweets = await repository.twitter.findMany({
                where: {
                    idUser: user?.idUser
                }
            })

            // output

            return res.status(200).send({
                ok: true,
                message: 'Login ok',
                data: {userLog:{user},tweetsLoaded:{tweets}}
            })


        } catch (error: any) {
            return serverError(res, error)

        }
    }

    // Create User
    public async createUser(req: Request, res: Response) {
        try {
            // input 
            const { name, email, username, password } = req.body
            !name || !email || !username || !password && fieldsNotProvided(res)

            //Processing
            const checkEmail = await repository.user.findFirst({
                where: { email },
            })
            checkEmail && existing(res, "Email")

            const checkUsername = await repository.user.findFirst({
                where: { username },
            })
            checkUsername && existing(res, "Username")

            const user = new User(name, email, username, password)
            const userInput = user.toUserCreateInput();


            const result = await repository.user.create({
                data: userInput
            })

            // output

            return successfully(res, "User", result)
        } catch (error: any) {
            return serverError(res, error)

        }
    }

    // Update User
    public async updateUser(req: Request, res: Response) {
        try {
            // input
            const { idUser } = req.params
            const { name, email, username, password } = req.body

            if (!name && !email && !username && !password) return res.status(400).send({
                ok: false,
                message: "Enter at least one field to update! Name, email, username or password."
            })

            // processing
            if (email) {
                const checkEmail = await repository.user.findFirst({
                    where: { email },
                })
                checkEmail && existing(res, "Email")
            }

            if (username) {
                const checkUsername = await repository.user.findFirst({
                    where: { username },
                })
                checkUsername && existing(res, "Username")
            }

            const result = await repository.user.update({
                where: {
                    idUser
                },
                data: {
                    name,
                    email,
                    username,
                    password,
                    dthrUpdated: new Date
                },
                select: {
                    name: true,
                    email: true,
                    username: true,
                    dthrUpdated: true,
                }
            })

            // output
            return res.status(200).send({
                ok: true,
                message: "update done successfully!",
                data: {
                    result
                }
            })
        } catch (error: any) {
            return serverError(res, error)

        }

    }

    // Delete User
    public async deleteUser(req: Request, res: Response) {
        try {
            //input
            const { idUser } = req.params
            const user = await repository.user.findFirst({
                where: { idUser }
            })

            !user && notFound(res, 'User')
            // processing
            const name = user?.name
            const result = await repository.user.delete({
                where: {
                    idUser
                }
            })

            // output

            res.status(200).send({
                ok: true,
                message: `${name} was excluded.`
            })


        } catch (error: any) {
            return serverError(res, error)
        }
    }

    // Search user
    public async searcheUser(req: Request, res: Response) {
        try {
            //imput
            const { idUser } = req.params

            //processing
            const user = await repository.user.findFirst({
                where: { idUser }
            })

            !user && notFound(res, 'User')

            // output

            return res.status(200).send({
                ok: true,
                message: 'User successfully obtained',
                data: user
            })

        } catch (error: any) {
            return serverError(res, error)

        }
    }

}