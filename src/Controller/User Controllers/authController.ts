import { Request, Response, NextFunction } from 'express';
import { userValidationType } from './../../Models/Validations/userValidation';
import User from '../../Models/UserModel';

export const userRegistration = (req:Request,res:Response,next:NextFunction) =>  {
   const validatedData=userValidationType.parse(req.body)
   
    
}

