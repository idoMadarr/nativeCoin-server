import { createClient } from 'redis';

// Production:
const client = createClient({
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 6379,
    tls: true,
  },
});

// Dev:
// const client = createClient();

client.on('error', error => console.log('Redis client error:', error));

client.connect();

export default client;
