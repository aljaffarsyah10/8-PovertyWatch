import { z } from "zod";

export const NewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  sourceId: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.enum(["newest", "oldest"]).default("newest"),
});

export const TriggerScrapingSchema = z.object({
  sourceId: z.string().uuid("Format sourceId harus UUID").optional(),
});
