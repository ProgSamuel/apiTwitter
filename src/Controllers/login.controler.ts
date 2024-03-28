import { Request, Response} from "express";
import { fieldsNotProvided, serverError } from "../Utils/response.helper";
import { validateToken } from "../Utils/login.helper";
import { PayloadToken } from "../contracts/login.contract";
import { LoginService } from "../services/login.service";

export class LoginController {
    public async login(req: Request, res: Response) {
        try {
            // input - need idUser - email || username - password
            const { email, username, password } = req.body

            if (!email && !username || !password) return fieldsNotProvided(res)

            // processing
            const loginService = new LoginService()

            if(email){
                const result = await loginService.loginEmail(email, password)
                // output
                return res.status(result.code).send(result)
            } else {
                const result = await loginService.loginUsername(username, password)
                // output
                return res.status(result.code).send(result)
            }
        } catch (error: any) {
            return serverError(res, error)
        }
    }
// colocar no service
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
