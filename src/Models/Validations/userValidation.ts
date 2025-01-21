import { z } from 'zod';

export const userValidationType = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
  profileImage: z.object({
    originalProfile: z.string().optional(),
    thumbnail: z.string().optional(),
  }).optional(),
  admin: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  phone: z.string().min(10),
  createdAt: z.date().optional(),
});

export type UserValidationSchema = z.infer<typeof userValidationType>;
