import 'dotenv/config';
import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
});

redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.on('ready', () => console.log('Redis connected'));

export default redisClient;
