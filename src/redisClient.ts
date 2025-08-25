import 'dotenv/config';
import { createClient } from 'redis';

const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6739,
        host: process.env.REDIS_URL,
        tls: true,
    },
});

redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.on('ready', () => console.log('Redis connected'));

export default redisClient;
