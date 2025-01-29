// import { log } from 'console';
// import { Request, Response, NextFunction } from 'express'

// interface CustomError extends Error {
//     statusCode?: number;
//     status?: string;
// }

// const ErrorManager = (
//     err: CustomError,
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): Response => {
//     const statusCode = err.statusCode || 500;
//     const message = err.message || 'internal server error';
//     const status = err.status

//     console.log(err);

//     return res.status(statusCode).json({
//         status, statusCode, message
//     })


// }
// export default ErrorManager

import { Request, Response, NextFunction } from "express";

// Define the CustomError interface with optional fields
interface CustomError extends Error {
  statusCode?: number;
  status?: string;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction // Keep this parameter even if not used
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const status = err.status || "error";

  console.error(message); // Log the error for debugging purposes

  res.status(statusCode).json({
    status,
    message,
    statusCode,
  });
};

export default errorHandler;
