import { log } from 'console';
import {Request,Response,NextFunction} from 'express'

interface CustomError extends Error {
    statusCode?:number ;
    status?:string ;
}

const ErrorManager=(
    err:CustomError,
    req:Request,
    res:Response,
    next:NextFunction
):Response=>{
    const statusCode=err.statusCode || 500 ;
    const message=err.message ||'internal server error';
    const status=err.status

    console.log(err);

    return res.status(statusCode).json({
        status,statusCode,message
    })
    

}
export default ErrorManager