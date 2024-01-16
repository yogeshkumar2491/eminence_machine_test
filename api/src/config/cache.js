const redis = require('redis'),
logger = require('../api/middleware/logger')('/redis.log', 'Redis');
const client = redis.createClient({ host: process.env.REDIS_HOST, db: 4 })

client.on('connect', function () {
});

client.on("error", function (err) {
	logger.log('error', err);
})

client.setData = (key, value) => {
	client.set(key, value);
}

client.getData = async (key) => {
	return client.get(key);
}

module.exports = client