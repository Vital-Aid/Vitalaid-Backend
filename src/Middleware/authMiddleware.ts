import { Jwt } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import CustomError from "../utils/CustomError";
import { Request, Response, NextFunction } from "express";



declare global {
    namespace Express {
        interface Request {
            user?: DecodedToken;
        }
    }
}

interface DecodedToken {
    id: string;
    email: string;
    role: string;
}

const userAuth = (req: Request, res: Response, next: NextFunction): void => {
    console.log(req);
    
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.startsWith('Bearer') ? authHeader.split(' ')[1] : null
    const refreshToken = req.cookies?.refreshToken
    console.log(refreshToken);
    if (!token) {
        const refreshToken = req.cookies?.refreshToken
        console.log(refreshToken);
        


        if (!refreshToken) {
            return next(new CustomError('Refresh token and access token are not available.', 404))
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as DecodedToken
        const newToken = jwt.sign({ id: decoded.id, email: decoded.email, role: decoded.role }, process.env.JWT_SECRET as string, { expiresIn: '1m' })
        res.cookie('accessToken', newToken, {
            httpOnly: true,
            secure: true,
            maxAge: 1 * 60 * 1000,
            sameSite: 'none',
        })


        req.user = decoded
        return next()
    } else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken
            req.user = decoded
            return next()
        } catch (error) {
            const refreshToken = req.cookies?.refreshToken

            if (!refreshToken) {
                return next(new CustomError('Refreshment token and access token are not available.', 404))
            }

            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as DecodedToken
            const newToken = jwt.sign({ id: decoded.id, email: decoded.email, role: decoded.role }, process.env.JWT_SECRET as string)
            res.cookie('accessToken', newToken, {
                httpOnly: true,
                secure: true,
                maxAge: 1 * 60 * 1000,
                sameSite: 'none',
            })

            req.user = decoded
            return next()
        }
    }
}

const adminAuth = (req: Request, res: Response, next: NextFunction): void => {

    userAuth(req, res, () => {


        if (req.user && req.user.role == 'Admin') {


            return next()
        } else {
            return next(new CustomError('You are not authorized', 403));
        }
    })

}

const doctorAuth = (req: Request, res: Response, next: NextFunction): void => {
    console.log('Doctor auth middleware');

    userAuth(req, res, () => {


        if (req.user && req.user.role == 'Doctor') {
            return next()
        } else {
            return next(new CustomError('You are not authorized', 403));
        }
    })

}

export { userAuth, adminAuth, doctorAuth }
