import { Response } from "express";
import { serverError } from "../Utils/response.helper";

export class StartController {
    public async start(res: Response) {
        try {
            const result = {
                ok: true,
                code:200,
                message: `Welcome! To learn how to use the API, visit: https://github.com/ProgSamuel/apiTwitter.git`
            }
            return res.status(200).send(result);
        } catch (error: any) {
            return serverError(res, error);
        }
    }
}
