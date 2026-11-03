import { z } from "zod";

export const CreateSourceSchema = z.object({
  name: z.string().min(3, "Nama sumber minimal 3 karakter").max(150),
  baseUrl: z.string().url("Base URL harus berupa URL valid"),
  feedUrl: z.string().url("Feed URL harus berupa URL valid").optional().nullable(),
  type: z.enum(["RSS", "HTML"]).default("RSS"),
  scrapeFrequency: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).default("DAILY"),
  isActive: z.boolean().default(true),
  selectorConfig: z
    .object({
      itemSelector: z.string().optional(),
      titleSelector: z.string().optional(),
      linkSelector: z.string().optional(),
      dateSelector: z.string().optional(),
      descriptionSelector: z.string().optional(),
    })
    .optional()
    .nullable(),
});

export const UpdateSourceSchema = CreateSourceSchema.partial();
