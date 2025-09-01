import { FastifyInstance } from 'fastify';
import mercurius from 'mercurius';
import { fetchQuotes, getQuoteLikes, likeQuote } from './service/quotesService';
import { Quote } from './types/quote';
import { z } from 'zod';
import { getComparableQuotes } from './utils/comparableQuotes';

const LikeIdSchema = z.object({
    id: z.number().int().positive(),
});

const schema = `
  type Quote {
    id: Int!
    quote: String!
    author: String!
    likes: Int!
  }

  type RandomQuoteResult {
    randomQuote: Quote!
    comparableQuotes: [Quote!]!
  }

  type Query {
    quotes: [Quote!]!
    quote(id: Int!): Quote
    randomQuoteWithComparable: RandomQuoteResult!
  }

  type Mutation {
    likeQuote(id: Int!): Quote
  }
`;

const resolvers = {
    Query: {
        quotes: async () => {
            const quotes = await fetchQuotes();
            return Promise.all(
                quotes.map(async (q: Quote) => ({
                    ...q,
                    likes: await getQuoteLikes(q.id),
                }))
            );
        },
        quote: async (_: any, { id }: { id: number }) => {
            const quotes = await fetchQuotes();
            const quote = quotes.find((q) => q.id === id);
            if (!quote) return null;
            const likes = await getQuoteLikes(id);
            return { ...quote, likes };
        },
        randomQuoteWithComparable: async () => {
            const quotes = await fetchQuotes();
            const quotesWithLikes = await Promise.all(
                quotes.map(async (q: Quote) => ({
                    ...q,
                    likes: await getQuoteLikes(q.id),
                }))
            );

            // Weighted random selection: each quote's chance is likes + 1
            const totalWeight = quotesWithLikes.reduce(
                (sum, q) => sum + q.likes + 1,
                0
            );
            let rand = Math.floor(Math.random() * totalWeight);
            let randomQuote: Quote = quotesWithLikes[0];
            for (const quote of quotesWithLikes) {
                rand -= quote.likes + 1;
                if (rand < 0) {
                    randomQuote = quote;
                    break;
                }
            }

            const comparableQuotes = getComparableQuotes(
                randomQuote,
                quotesWithLikes
            );

            return {
                randomQuote,
                comparableQuotes,
            };
        },
    },
    Mutation: {
        likeQuote: async (_: any, { id }: { id: number }) => {
            const parseResult = LikeIdSchema.safeParse({ id });
            if (!parseResult.success) {
                throw new Error('Invalid quote ID');
            }
            const quotes = await fetchQuotes();
            const quote = quotes.find((q) => q.id === id);
            if (!quote) return null;
            await likeQuote(id);
            const likes = await getQuoteLikes(id);
            return { ...quote, likes };
        },
    },
};

export default async function graphqlRoutes(fastify: FastifyInstance) {
    fastify.register(mercurius, {
        schema,
        resolvers,
        graphiql: true,
    });
}
