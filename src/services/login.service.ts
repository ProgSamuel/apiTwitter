import { Result } from "../contracts/result.contract";
import repository from "../database/prisma.repository";

export class LoginService {
    public async login(idUser:string, token:string):Promise<Result>{
        try {
            const result = await repository.user.update({
                where: { idUser },
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