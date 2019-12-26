const getDataForQeues = require('./getDataForQeues')

const redis = require('redis')
const client = redis.createClient()

module.exports = async function handler(req, res) {
  let redisQueues = await redisClient()
  res.json(
    await getDataForQeues({
      queues: req.app.locals.queues,
      query: req.query,
      redisQueues,
    }),
  )
}
const redisClient = () => {
  return new Promise((resolve, reject) => {
    client.keys('bull:*:id', async (err, reply) => {
      if (err) reject(err)
      resolve(reply)
    })
  })
}
