import { generatetoken } from "../Utils/login.helper";
import { Result } from "../contracts/result.contract";
import repository from "../database/prisma.repository";

export class LoginService {
    public async loginEmail(email:string, password:string):Promise<Result>{
        try {
            if (!email || !password) return {
                ok: false,
                code: 400,
                message: "Fill in all mandatory fields"
            }

            const user = await repository.user.findFirst({
                where: { email },
            })
            if (!user) return {
                ok: false,
                code: 404,
                message: "Email does not exist"
            }
            if (user?.password !== password ) {
                return {
                    ok:false,
                    code: 400,
                    message: "Invalid password"
                }
            }
            const payload = {
                id: user.idUser,
                username: user.username,
                email: user.email,
            }
            const token: string = generatetoken(payload)

            const result = await repository.user.update({
                where: { idUser: user.idUser },
                data: { token },
            })
            return {
                ok: true,
                code: 200,
                message: 'Login ok',
                data: result
            }
        } catch (error:any) {
            return {
                ok: false,
                code: 500,
                message: "Error when logging in.",
                data: error.toString()
            }
        }
    }
    public async loginUsername ( username:string, password:string):Promise<Result>{
        try {
            if (!username || !password) return {
                ok: false,
                code: 400,
                message: "Fill in all mandatory fields"
            }

            const user = await repository.user.findFirst({
                where: { username },
            })
            if (!user) return {
                ok: false,
                code: 404,
                message: "Username does not exist"
            }
            if (user?.password !== password ) {
                return {
                    ok:false,
                    code: 400,
                    message: "Invalid password"
                }
            }
            const payload = {
                id: user.idUser,
                username: user.username,
                email: user.email,
            }
            const token: string = generatetoken(payload)

            const result = await repository.user.update({
                where: { idUser: user.idUser },
                data: { token },
            })
            return {
                ok: true,
                code: 200,
                message: 'Login ok',
                data: result
            }
        } catch (error:any) {
            return {
                ok: false,
                code: 500,
                message: "Error when logging in.",
                data: error.toString()
            }
        }
    }
}