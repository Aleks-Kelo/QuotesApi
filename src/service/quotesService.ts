import { QuotesResponseSchema, Quote } from '../types/quote';
import redisClient from '../redisClient';

export async function fetchQuotes(): Promise<Quote[]> {
    const res = await fetch('https://dummyjson.com/quotes');
    const data = await res.json();

    const parsed = QuotesResponseSchema.safeParse(data);
    if (!parsed.success) {
        throw new Error('Invalid quotes data from API');
    }

    return parsed.data.quotes;
}

export async function getQuoteLikes(quoteId: number): Promise<number> {
    const likes = await redisClient.get(`quote:${quoteId}:likes`);
    return likes ? parseInt(likes) : 0;
}

export async function likeQuote(quoteId: number): Promise<number> {
    const likes = await redisClient.incr(`quote:${quoteId}:likes`);
    return likes;
}
