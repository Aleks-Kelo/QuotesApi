import 'dotenv/config';
import { createClient } from 'redis';

const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        port: process.env.REDIS_PORT
            ? parseInt(process.env.REDIS_PORT, 10)
            : 6380,
        host: process.env.REDIS_HOST
            ? process.env.REDIS_HOST.replace(/^rediss?:\/\//, '') // remove redis:// or rediss://
            : 'quotes-redis-12345.redis.cache.windows.net',
        tls: true, // Azure Redis requires TLS on 6380
    },
});

redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.on('ready', () => console.log('Redis connected'));

export default redisClient;
