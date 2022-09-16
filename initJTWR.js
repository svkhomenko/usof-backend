// const redis = require("redis");
// const JWTR = require("jwt-redis").default;

// async function signJWTToken(...data) {
//     const redisClient = redis.createClient();
//     await redisClient.connect();
//     const jwtr = new JWTR(redisClient);

//     const token = await jwtr.sign(...data);
//     return token;
// }

// async function verifyJWTToken(token, secret) {
//     const redisClient = redis.createClient();
//     await redisClient.connect();
//     const jwtr = new JWTR(redisClient);

//     const data = await jwtr.verify(token, process.env.JWT_KEY);
//     return data;
// }

// async function destroyJWTToken(token) {
//     const redisClient = redis.createClient();
//     await redisClient.connect();
//     const jwtr = new JWTR(redisClient);
//     await jwtr.destroy(token);
// }

// module.exports = {
//     signJWTToken,
//     verifyJWTToken,
//     destroyJWTToken
// };

