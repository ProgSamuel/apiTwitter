import { Request, Response } from "express";
import repository from "../database/prisma.repository";
import { notFound, serverError } from "../Utils/response.helper";
import { LoginService } from "../services/login.service";

export const checkId = async (req: Request, res: Response, next: () => void) => {
    try {
        const loginService = new LoginService()
        const { idUser } = req.params;
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).send({
                ok: false,
                message: "Authentication token not provided",
            });
        }
        const user = await repository.user.findUnique({
            where: { idUser },
        });

        if (!user) { return notFound(res, "User")}

        const login = await loginService.validateLogin( authorization, user.idUser);
        if (login) {return next()
        } else {res.status(400).send("Erro")
        }
    } catch (error) {
        return serverError(res, error);
    }
};