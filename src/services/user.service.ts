import { User } from "../Models/user.model";
import { Result } from "../contracts/result.contract"
import { UserCreatedDTO, UserUpdateDTO } from "../contracts/user.contract";
import repository from "../database/prisma.repository"

export class UserService {
    public async createUser(data:UserCreatedDTO): Promise<Result> {
        try {
            const checkEmail = await repository.user.findFirst({
                where: { email: data.email },
            })
            if (checkEmail) {
                return {
                    ok: false,
                    code: 409,
                    message: "Email already exists"
                }
            } 

            const checkUsername = await repository.user.findUnique({
                where: { username:data.username },
            })
            if (checkUsername) {
                return {
                    ok: false,
                    code: 409,
                    message: "Username already exists"
                }
            }             
            const user = new User(data.name, data.email, data.username, data.password)
            const userInput = user.toUserCreateInput();

            const result = await repository.user.create({
                data: userInput
            })

            return {
                ok: true,
                code:200,
                message: "User created.",
                data:result
            }
        } catch (error: any) {
            return {
                ok: false,
                code: 500,
                message: error.toString(),
            }
        }
    }

    public async deleteUser(idUser:string): Promise<Result> {
        try {
            const user = await repository.user.findFirst({
                where: { idUser }
            })

            if (!user) {
                return {
                    ok: false,
                    code: 404,
                    message: 'User does not exist.'
                }
            }
            await repository.user.delete({
                where: {
                    idUser
                }
            })
            return {
                ok: true,
                code:200,
                message: `${user?.username} was excluded.`
            }
        } catch (error: any) {
            return {
                ok: false,
                code: 500,
                message: error.toString(),
            }
        }
    }

    public async updateUser(data:UserUpdateDTO): Promise<Result> {
        try {
                const checkID = await repository.user.findFirst({
                    where:{
                        idUser:data.idUser
                    }
                })
                if (!checkID) {
                    return {
                        ok:false,
                        code:404,
                        message: 'User does not exist'
                    }
                }
            
            if (data.email) {
                const checkEmail = await repository.user.findUnique({
                    where: { email:data.email },
                })
                if (checkEmail?.email) {
                    return {
                        ok: false,
                        code: 409,
                        message: "Email already exists"
                    }
                } 
            }

            if (data.username) {
                const checkUsername = await repository.user.findUnique({
                    where: { username :data.username},
                })
                if (checkUsername) {
                    return {
                        ok: false,
                        code: 409,
                        message: "Username already exists"
                    }
                }  
            }

            const result = await repository.user.update({
                where: {
                    idUser:data.idUser
                },
                data: {
                    name: data.name,
                    email:data.email,
                    username:data.username,
                    password: data.password,
                    dthrUpdated: new Date
                },
                select: {
                    name: true,
                    email: true,
                    username: true,
                    dthrUpdated: true,
                }
            })
            return {
                ok: true,
                code:200,
                message: "User updated.",
                data:result
            }
        } catch (error: any) {
            return {
                ok: false,
                code: 500,
                message: error.toString(),
            }
        }
    }

    public async searcheUser(idUser:string): Promise<Result> {
        try {
            const user = await repository.user.findFirst({
                where: { idUser }
            })
            if(!user){
                return {
                    ok: false,
                    code:404,
                    message: 'User not found.',
                }
            } else {
                return {
                    ok: true,
                    code:200,
                    message: 'User successfully obtained',
                    data: user
                }
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