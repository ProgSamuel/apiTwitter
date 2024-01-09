import { Request, Response } from "express";
import { User } from "../Models/user.model";
import repository from "../database/prisma.repository";
import { notFound, serverError } from "../Utils/response.helper";

export const checkId = async (req: Request, res: Response, next: () => void) => {
    try {
        const { idUser } = req.params;
        const { authorization } = req.headers;

        // checked authorization
        if (!authorization) {
            return res.status(401).send({
                ok: false,
                message: "Authentication token not provided",
            });
        }

        // search user 
        const user = await repository.user.findUnique({
            where: { idUser },
        });

        // checked id
        if (!user) {
            return notFound(res, "User");
        }

        if (authorization !== user.token) {
            return res.status(401).send({
                ok: false,
                message: "Unauthorized access",
            });
        }

        next();
    } catch (error) {
        return serverError(res, error);
    }
};
