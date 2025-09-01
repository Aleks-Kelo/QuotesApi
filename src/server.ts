import Fastify from 'fastify';
import restRoutes from './rest';
import graphqlRoutes from './graphql';
import redisClient from './redisClient';

const fastify = Fastify({ logger: true });

async function start() {
    await redisClient.connect(); // Ensure Redis is connected before starting server
    restRoutes(fastify);
    graphqlRoutes(fastify);

    const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
    fastify.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
        fastify.log.info(`Server listening at ${address}`);
    });
}

start();
