"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
// import * as dotenv from 'dotenv';
// dotenv.config();
// Production:
const client = (0, redis_1.createClient)({
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
exports.default = client;
