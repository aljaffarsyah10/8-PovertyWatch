import { z } from "zod";

export const ClassificationResultSchema = z.object({
  category: z.string().min(1),
  categorySlug: z.string().min(1),
  confidence: z.number().min(0).max(1),
  reason: z.string().min(1),
});

export type ClassificationResult = z.infer<typeof ClassificationResultSchema>;

export const SummaryResultSchema = z.object({
  summary: z.string().min(1),
  keyPoints: z.array(z.string()).default([]),
});

export type SummaryResult = z.infer<typeof SummaryResultSchema>;

export interface AIProvider {
  name: string;
  classifyNews(title: string, content: string): Promise<ClassificationResult>;
  summarizeNews(title: string, content: string): Promise<SummaryResult>;
}

