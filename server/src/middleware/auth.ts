import { Response, Request, NextFunction } from "express"

export const auth = async(req:Request, res:Response, next:NextFunction) =>{
    console.log(req.body)
}

