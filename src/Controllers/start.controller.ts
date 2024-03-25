import { Response } from "express";
import { serverError } from "../Utils/response.helper";

export class StartController {
    public async start(res: Response) {
        try {
            return res.status(200).send({
                ok: true,
                message: `Welcome! To learn how to use the API, visit: https://github.com/ProgSamuel/apiTwitter.git`
            });
        } catch (error: any) {
            return serverError(res, error);
        }
    }
}
