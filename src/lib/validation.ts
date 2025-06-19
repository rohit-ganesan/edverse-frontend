import { z } from 'zod';
import { validationMessages } from './errorUtils';

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, validationMessages.emailRequired)
  .email(validationMessages.emailInvalid);

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(1, validationMessages.passwordRequired)
  .min(6, validationMessages.passwordTooShort);

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, validationMessages.passwordRequired),
});

/**
 * Sign up form validation schema
 */
export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: validationMessages.passwordMismatch,
    path: ['confirmPassword'],
  });

/**
 * Type definitions derived from schemas
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;

/**
 * Validation result interface
 */
export interface ValidationResult {
  success: boolean;
  errors?: Record<string, string>;
  data?: unknown;
}

/**
 * Validate data against a schema and return user-friendly errors
 */
export function validateWithSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return {
        success: false,
        errors,
      };
    }
    return {
      success: false,
      errors: { general: 'Validation failed. Please check your input.' },
    };
  }
}
