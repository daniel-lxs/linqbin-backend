import { z } from 'zod';
export const createEntryDto = {
  title: z.string().optional(),
  content: z.string(),
  ttl: z
    .number()
    .min(1)
    .max(7 * 24), //hours 1 week max
  visitCountThreshold: z.number().min(0), // 0 = never
};
