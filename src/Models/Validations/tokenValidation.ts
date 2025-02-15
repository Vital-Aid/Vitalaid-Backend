import { z } from "zod";
import mongoose from "mongoose";

const statusEnum = z.enum(["pending", "cancelled", "Completed"]);

export const tokenValidationSchema = z.object({
  doctorId: z.string().nonempty("Doctor ID is required").refine(
    (id) => mongoose.Types.ObjectId.isValid(id),
    { message: "Invalid doctor ID format" }
  ),  
  date: z
  .string()
  .transform((date) => {
    const sanitizedDate = date.replace(/\//g, "-"); 
    const [day, month, year] = sanitizedDate.split("-");
    return `${year}-${month}-${day}`;
  })
  .refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  status: statusEnum.default("pending"), 
  tokenNumber: z
    .number()
    .int({ message: "Token number must be an integer." })
    .positive({ message: "Token number must be a positive value." }),
});

export type TokenValidationType = z.infer<typeof tokenValidationSchema>;
