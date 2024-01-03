import { Request, Response } from "express";

export function serverError (res:Response, error:any){
    return res.status(500).send(
        {
            ok: false,
            message: error.toString()
        }
    )
}

export function notFound (res:Response, entity:string){
    return res.status(404).send({
        ok: false,
        message: `${entity} does not exist`
    }
    )
}

export function fieldsNotProvided (res:Response){
    return res.status(400).send({
        ok: false,
        message:'Fill in all mandatory fields'
    }
    )
}

export function successfully(res:Response, entity:string, result:any){
    res.status(201).send({
        ok: true,
        message: `${entity} created successfully`,
        data: result
    })
}

export function existing (res:Response, entity:string){
    res.status(409).send({
        ok:false,
        message: `${entity} already exists`
    })
}

export function invalidData (res:Response){
    res.status(400).send({
        ok:false,
        message: 'invalid data'
    })
}