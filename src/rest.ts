import { FastifyInstance, FastifyRequest } from 'fastify';
import { fetchQuotes, getQuoteLikes, likeQuote } from './service/quotesService';
import { z } from 'zod';
import { Quote } from './types/quote';
import { getComparableQuotes } from './utils/comparableQuotes';

const LikeParamsSchema = z.object({
    id: z.string().regex(/^\d+$/),
});

export default async function restRoutes(fastify: FastifyInstance) {
    fastify.get('/', async (request, reply) => {
        return {
            message: 'Welcome to the Quote API!',
            docs: 'https://github.com/Aleks-Kelo/QuotesApi/blob/main/README.md',
            availableEndpoints: [
                '/quotes',
                '/quotes/:id',
                '/quotes/random',
                '/quotes/:id/like',
                '/graphiql',
            ],
        };
    });

    fastify.get('/quotes', async (request, reply) => {
        const quotes = await fetchQuotes();
        const quotesWithLikes = await Promise.all(
            quotes.map(async (q) => ({
                ...q,
                likes: await getQuoteLikes(q.id),
            }))
        );
        return quotesWithLikes;
    });

    fastify.get('/quotes/random', async (request, reply) => {
        const quotes = await fetchQuotes();
        const quotesWithLikes = await Promise.all(
            quotes.map(async (q) => ({
                ...q,
                likes: await getQuoteLikes(q.id),
            }))
        );

        // Calculate total likes (add 1 to each to avoid zero weight)
        const totalWeight = quotesWithLikes.reduce(
            (sum, q) => sum + q.likes + 1,
            0
        );

        // Weighted random selection
        let rand = Math.floor(Math.random() * totalWeight);
        let randomQuote: Quote = quotesWithLikes[0];
        for (const quote of quotesWithLikes) {
            rand -= quote.likes + 1;
            if (rand < 0) {
                randomQuote = quote;
                break;
            }
        }
        //Find comparable quotes
        const comparableQuotes = getComparableQuotes(
            randomQuote,
            quotesWithLikes
        );

        return {
            randomQuote,
            comparableQuotes,
        };
    });

    fastify.get('/quotes/:id', async (request, reply) => {
        const parseResult = LikeParamsSchema.safeParse(request.params);
        if (!parseResult.success) {
            reply.status(400).send({ error: 'Invalid quote ID' });
            return;
        }
        const quoteId = Number(parseResult.data.id);
        const quotes = await fetchQuotes();
        const quote = quotes.find((q) => q.id === quoteId);
        if (!quote) {
            reply.status(404).send({ error: 'Quote not found' });
            return;
        }
        const likes = await getQuoteLikes(quoteId);
        return { ...quote, likes };
    });

    fastify.post('/quotes/:id/like', async (request, reply) => {
        const parseResult = LikeParamsSchema.safeParse(request.params);
        if (!parseResult.success) {
            reply.status(400).send({ error: 'Invalid quote ID' });
            return;
        }
        const quoteId = Number(parseResult.data.id);
        const likes = await likeQuote(quoteId);
        return { quoteId, likes };
    });
}
