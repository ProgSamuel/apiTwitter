import { Request, Response } from "express";
import repository from "../database/prisma.repository";
import { User } from "../Models/user.model";

export class UserController {
    // Create User
    public async createUser(req: Request, res: Response) {
        try {
            // Entrada 
            const { name, email, username, password } = req.body
            !name || !email || !username || !password && res.status(400).send({
                ok: false,
                message: 'Mandatory fields were not filed in'
            }
            )

            //Processamento
            const user = new User(name, email, username, password)
            const userInput = user.toUserCreateInput();


            const result = await repository.user.create({
                data: userInput
            })

            //Saída

            return res.status(201).send({
                ok: true,
                message: 'User created successfully',
                data: result
            })
        } catch (error: any) {
            return res.status(500).send(
                {
                    ok: false,
                    message: error.toString()
                }
            )

        }
    }

    // Search user
    public async searcheUser(req: Request, res: Response) {
        try {
            //imput
            const { idUser } = req.params

            //processing
            const user = await repository.user.findFirst({
                where:{idUser}
            })

            // output

            return res.status(200).send({
                ok:true,
                message: 'User successfully obtained',
                data:user
            })

        } catch (error: any) {
            return res.status(500).send(
                {
                    ok: false,
                    message: error.toString()
                }
            )

        }
    }
}