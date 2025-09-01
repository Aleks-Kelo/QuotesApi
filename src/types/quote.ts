import { z } from 'zod';

export const QuoteSchema = z.object({
    id: z.number(),
    quote: z.string(),
    author: z.string(),
    likes: z.number().default(0),
});

export const QuotesResponseSchema = z.object({
    quotes: z.array(QuoteSchema),
    total: z.number(),
    skip: z.number(),
    limit: z.number(),
});

export type Quote = z.infer<typeof QuoteSchema>;
export type QuotesResponse = z.infer<typeof QuotesResponseSchema>;
