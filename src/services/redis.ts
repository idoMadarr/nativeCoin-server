import { createClient } from 'redis';
// import * as dotenv from 'dotenv';
// dotenv.config();

// Production:
const client = createClient({
  username: 'red-cm3e4cen7f5s73bnr0dg',
  password: 'SoO0Cvg9p8qYtdOht5y5u3B0GnLJkisa',
  socket: {
    host: 'oregon-redis.render.com',
    port: 6379,
    tls: true,
  },
});

// Dev:
// const client = createClient();

client.on('error', error => console.log('Redis client error:', error));

client.connect();

export default client;
