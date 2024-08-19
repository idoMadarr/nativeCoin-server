import { createClient } from 'redis';

const client = createClient();

client.connect();

client.on('error', error => console.log('Redis client error:', error));

export default client;
