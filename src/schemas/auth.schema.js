import * as z from "zod";

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required.")
      .min(3, "Name must be at least 3 characters.")
      .max(100, "Name cannot exceed 100 characters."),
    email: z.email("Invalid email"),
    password: z
      .string()
      .trim()
      .min(1, "Password is required.")
      .min(6, "Password must be at least 6 characters.")
      .max(100, "Password cannot exceed 100 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
