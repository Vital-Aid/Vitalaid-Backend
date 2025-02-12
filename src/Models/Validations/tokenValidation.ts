import {z} from 'zod'
import mongoose from 'mongoose'

const statusEnum = z.enum(["pending", "cancelled", "Completed"]);

export const tokenValidationSchema = z.object({
  patientId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid patient ID format",
  }),
  doctorId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid doctor ID format",
  }),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  status: statusEnum,
  tokenNumber: z
  .number()
  .int({ message: "Token number must be an integer." })
  .positive({ message: "Token number must be a positive value." }),
});


export type TokenValidationType = z.infer<typeof tokenValidationSchema>;