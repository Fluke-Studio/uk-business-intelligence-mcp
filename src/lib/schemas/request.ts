import { z } from 'zod';

export const enrichRequestSchema = z.object({
  business_name: z.string().min(1, 'business_name is required').max(200),
  location: z.string().min(1, 'location is required').max(200),
  company_number: z.string()
    .regex(/^([0-9]{8}|[A-Za-z]{2}[0-9]{6})$/, 'Must be 8 digits or 2 letters + 6 digits (e.g. 12345678 or SC123456)')
    .transform((v) => v.toUpperCase())
    .optional(),
  domain: z.string()
    .max(253)
    .regex(/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i, 'Must be a valid domain (e.g. example.co.uk)')
    .optional(),
});

export type EnrichRequest = z.infer<typeof enrichRequestSchema>;

export const createKeyRequestSchema = z.object({
  email: z.string().email('Valid email is required'),
  plan: z.enum(['free', 'starter', 'growth', 'scale']).optional().default('free'),
});

export type CreateKeyRequest = z.infer<typeof createKeyRequestSchema>;
