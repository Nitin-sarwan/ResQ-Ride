const redis = require('redis');
const { promisify } = require('util');

const redisClient = redis.createClient();
redisClient.on('error', (error) => console.error(`Redis error: ${error}`));

const setAsync = promisify(redisClient.set).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);

module.exports = { redisClient, setAsync, getAsync };