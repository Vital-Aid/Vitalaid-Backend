import { Request, Response, NextFunction } from 'express';
import User from '../../Models/UserModel';
import bcrypt from 'bcrypt';

export const userRegistration = async(req:Request,res:Response,next:NextFunction) =>  {
  
   const{name,email,password,phone}=req.body
   const hashedPassword=await bcrypt.hash(password,6)

   // const otp=(Math.floor(Math.random()*900000)+100000).toString()
   const newUser=await new User({
      name,
      email,
      password:hashedPassword,
      phone,
      
   })
   await newUser.save()
   // const emailTemplate= `<h1>Welcome, ${name}!</h1>
   // <p>Your OTP for email verification is:</p>
   // <h2>${otp}</h2>
   // <p>Please use this OTP to verify your email.</p>`;

   // await sendEmail(email,'Verify Your Email with OTP',emailTemplate)
   res.status(200).json({
      errorcode: 0,
      status: true,
      msg: "User registered successfully. Please check your email for the OTP.",
      newUser,
  });
    
}




module.exports={
   userRegistration
}

