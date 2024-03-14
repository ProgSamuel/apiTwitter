import { Request, Response, response } from "express";
import { fieldsNotProvided, invalidData, notFound, serverError } from "../Utils/response.helper";
import repository from "../database/prisma.repository";
import { generatetoken, validateToken } from "../Utils/login.helper";
import { PayloadToken } from "../contracts/login.contract";

export class LoginController {
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
            })

            user?.password !== password && invalidData(res)

            const payload = {
                id: user?.idUser,
                username: user?.username,
                email: user?.email,
            }
            const token: string = generatetoken(payload)

            await repository.user.update({
                where: { idUser: user?.idUser },
                data: { token },
            })

            // output

            return res.status(200).send({
                ok: true,
                message: 'Login ok',
                data: { ...user, token }
            })

        } catch (error: any) {
            return serverError(res, error)
        }
    }

    public async validateLogin( token: string, idUser: string) {
        try {
            const payload = await validateToken(token) as PayloadToken;

            if (!payload || idUser !== payload.id) {
                // return res.status(401).send({
                //     ok: false,
                //     message: "Invalid token",
                //     data: payload
                // });
                return false
            }
            // return res.status(200).send({
            //     ok: true,
            //     message: "login ok"
            // });
            return true
        } catch (error: any) {
            return {
                ok: false
            }
        }
    }
}
