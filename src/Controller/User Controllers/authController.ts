import { Request, Response, NextFunction } from "express";
import User from "../../Models/UserModel";
import jwt from "jsonwebtoken";
import Doctor from "../../Models/Doctor";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import CustomError from "../../../utils/CustomError";
dotenv.config();

export const userRegistration = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const { name, email, password, phone } = req.body;
   const hashedPassword = await bcrypt.hash(password, 6);

   // const otp=(Math.floor(Math.random()*900000)+100000).toString()
   const newUser = await new User({
      name,
      email,
      password: hashedPassword,
      phone,
   });
   await newUser.save();
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
};


export const docterRegistration = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const { name, email, password, phone } = req.body;
   const hashedPassword = await bcrypt.hash(password, 6);

   // const otp=(Math.floor(Math.random()*900000)+100000).toString()
   const newDoctor = await new Doctor({
      name,
      email,
      password: hashedPassword,
      phone,
   });
   await newDoctor.save();
   // const emailTemplate= `<h1>Welcome, ${name}!</h1>
   // <p>Your OTP for email verification is:</p>
   // <h2>${otp}</h2>
   // <p>Please use this OTP to verify your email.</p>`;

   // await sendEmail(email,'Verify Your Email with OTP',emailTemplate)
   res.status(200).json({
      errorcode: 0,
      status: true,
      msg: "User registered successfully. Please check your email for the OTP.",
      newDoctor,
   });
};



export const userLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   const { email, password } = req.body;

   let user =await User.findOne({ email,admin:false });
   let userType = "User";

   if (!user) {
      user = await Doctor.findOne({ email });
      userType = "Doctor";
   }

   if(!user){
    user=await User.findOne({ email,admin:true })
    userType='Admin'
   }

   if (!user) {
      return next(new CustomError("User not found", 404))

   }

   const isPasswordValid = await bcrypt.compare(password, user.password);
   if (!isPasswordValid) {
      return next(new CustomError("Invalid email or password", 404));

   }

   const token = jwt.sign(
      {
         id: user._id,
         email: user.email,
         role:userType,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1m" }
   );
  
   const refreshmentToken = jwt.sign(
    {
       id: user._id,
       email: user.email,
       role:userType,

    },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
 );

 res.cookie('accessToken', token, {
  httpOnly: true,
  secure: true,
  maxAge: 60 * 1000, // 1 minute
  sameSite: 'none', 
});
res.cookie('refreshmentToken', refreshmentToken, {
  httpOnly: true,
  secure: true,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  sameSite: 'none',
});



   res.status(200).json({
      error: false,
      message:`${userType} Login successfully`,
      accessToken:token,
      refreshmentToken:refreshmentToken,
      user: {
         id: user._id,
         name: user.name,
         email: user.email,
         role:userType,
      },
   });
};
