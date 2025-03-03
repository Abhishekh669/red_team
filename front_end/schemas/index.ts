
import * as z from "zod";

export const formSchema = z.object({
    email: z.string().trim().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().trim().min(1, {
      message: "Password must be at 1 characters long.",
    }),
  })
  
  
  export const register_schema = z.object({
    email: z.string().trim().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().trim().min(8, {
      message: "Password must be at least 8 characters long.",
    }),
  });