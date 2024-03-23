import { Request, Response} from "express";
import { fieldsNotProvided, notFound, serverError } from "../Utils/response.helper";
import repository from "../database/prisma.repository";
import { validateToken } from "../Utils/login.helper";
import { PayloadToken } from "../contracts/login.contract";
import { LoginService } from "../services/login.service";

export class LoginController {
    public async login(req: Request, res: Response) {
        try {
            // input - need idUser - email || username - password
            const { email, username, password } = req.body
            if (!email && !username || !password) return fieldsNotProvided(res);
            const checkEmail = await repository.user.findFirstOrThrow({
                where: { email },
            })
            const checkUsername = await repository.user.findFirstOrThrow({
                where: { username },
            })

            if (!checkEmail && !checkUsername) return notFound(res, "Email o username")

            // processing
            const loginService = new LoginService()
            const result = await loginService.login(email, username, password)

            // output
            return res.status(result.code).send(result)
        } catch (error: any) {
            return serverError(res, error)
        }
    }

    public async validateLogin( token: string, idUser: string) {
        try {
            const payload = await validateToken(token) as PayloadToken;
            if (!payload || idUser !== payload.id) {
                return false
            }
            return true
        } catch (error: any) {
            return {
                ok: false
            }
        }
    }
}
