import { Request, Response } from "express";
import { fieldsNotProvided, serverError } from "../Utils/response.helper";
import { UserService } from "../services/user.service";
export class UserController {

    // Create User
    public async createUser(req: Request, res: Response) {
        try {
            // input 
            const { name, email, username, password } = req.body

            if (!name || !email || !username || !password) {
                return fieldsNotProvided(res)
            }

            //Processing
            const userService = new UserService()
            const result = await userService.createUser({
                name, email, username, password
            })
            // output
            return res.status(result.code).send(result)
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
            const userService = new UserService()

            const result = await userService.updateUser({idUser, name, email, username, password})
            // output
            return res.status(result.code).send(result)
        } catch (error: any) {
            return serverError(res, error)

        }

    }

    // Delete User
    public async deleteUser(req: Request, res: Response) {
        try {
            //input
            const { idUser } = req.params
            
            // processing
            const userService = new UserService()
            const result = await userService.deleteUser(idUser)

            // output
            res.status(result.code).send(result)
        } catch (error: any) {
            return serverError(res, error)
        }
    }
}