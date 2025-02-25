import { Request, Response, NextFunction } from "express";
import User from "../../Models/UserModel";
import jwt from "jsonwebtoken";
import Doctor from "../../Models/Doctor";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import CustomError from "../../utils/CustomError";
dotenv.config();

export const userRegistration = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const { name, email, password, phone } = req.body;
   const hashedPassword = await bcrypt.hash(password, 6);


   const newUser = await new User({
      name,
      email,
      password: hashedPassword,
      phone,
   });
   await newUser.save();

   res.status(200).json({
      error: false,
      status: true,
      msg: "User registered successfully. Please check your email for the OTP.",
      data: newUser,
   });
};


export const docterRegistration = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const { name, email, password, phone } = req.body;
   const hashedPassword = await bcrypt.hash(password, 6);

   const newDoctor = await new Doctor({
      name,
      email,
      password: hashedPassword,
      phone,
   });
   await newDoctor.save();


   res.status(200).json({
      error: false,
      status: true,
      msg: "User registered successfully. Please check your email for the OTP.",
      data: newDoctor,
   });
};



export const userlogin = async (req: Request, res: Response, next: NextFunction) => {
   const { email, password } = req.body
   const user = await User.findOne({ email, admin: false })
   if (!user) {
      return next(new CustomError('user not found', 404))
   }
   const isPasswordValid = await bcrypt.compare(password, user.password);
   if (!isPasswordValid) {
      return next(new CustomError("Invalid email or password", 404));

   }

   const token = jwt.sign(
      {
         id: user._id,
         email: user.email,
         role: 'User',
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1m" }
   );

   const refreshmentToken = jwt.sign(
      {
         id: user._id,
         email: user.email,
         role: 'User',

      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
   );
    
   await User.findByIdAndUpdate(user._id, { updatedAt: Date.now() }, { new: true });

   res.cookie('accessToken', token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 1000,
      sameSite: 'none',
   });
   res.cookie('refreshToken', refreshmentToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
   });

   res.cookie(`user`, "user", {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
   });



   res.status(200).json({
      error: false,
      message: `user Login successfully`,
      accessToken: token,
      refreshmentToken: refreshmentToken,
      user: {
         id: user._id,
         name: user.name,
         email: user.email,
         role: 'User',
         phone: user.phone
      },
   });
}

export const doctorlogin = async (req: Request, res: Response, next: NextFunction) => {
   const { email, password } = req.body
   const doctor = await Doctor.findOne({ email })
   if (!doctor) {
      return next(new CustomError('Doctor not found', 404))
   }
   const isPasswordValid = await bcrypt.compare(password, doctor.password);
   if (!isPasswordValid) {
      return next(new CustomError("Invalid email or password", 404));

   }

   const token = jwt.sign(
      {
         id: doctor._id,
         email: doctor.email,
         role: 'Doctor',
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1m" }
   );

   const refreshToken = jwt.sign(
      {
         id: doctor._id,
         email: doctor.email,
         role: 'Doctor',

      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
   );

   res.cookie('accessToken', token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 1000,
      sameSite: 'none',
   });
   res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
   });

   res.cookie(`user`, "Doctor", {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
   });



   res.status(200).json({
      error: false,
      message: `Doctor Login successfully`,
      user: {
         id: doctor._id,
         name: doctor.name,
         email: doctor.email,
         role: 'Doctor',

         phone: doctor.phone
      },
   });
}


export const adminlogin = async (req: Request, res: Response, next: NextFunction) => {
   const { email, password } = req.body
   const user = await User.findOne({ email, admin: true })
   if (!user) {
      return next(new CustomError('user not found', 404))
   }
   const isPasswordValid = await bcrypt.compare(password, user.password);
   if (!isPasswordValid) {
      return next(new CustomError("Invalid email or password", 404));

   }

   const token = jwt.sign(
      {
         id: user._id,
         email: user.email,
         role: 'Admin',
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1m" }
   );

   const refreshmentToken = jwt.sign(
      {
         id: user._id,
         email: user.email,
         role: 'Admin',

      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
   );

   res.cookie('accessToken', token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 1000,
      sameSite: 'none',
   });
   res.cookie('refreshToken', refreshmentToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
   });

   res.cookie(`user`, "Admin", {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
   });



   res.status(200).json({
      error: false,
      message: `Admin Login successfully`,
      user: {
         id: user._id,
         name: user.name,
         email: user.email,
         role: 'Admin',
         phone: user.phone
      },
   });
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
   res.clearCookie('user')
   res.clearCookie('refreshToken')
   res.clearCookie('accessToken')
   
   res.json({ message: 'Logged out successfully' });
}
