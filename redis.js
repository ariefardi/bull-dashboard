const { createQueues, setQueues, UI } = require('.')
const app = require('express')()
// const sleep = t => new Promise(resolve => setTimeout(resolve, t * 1000))
const fs = require('fs')
const redisOptions = {
  redis: {
    port: 6379,
    host: 'localhost',
    password: '',
    tls: false,
  },
}
const PORT = 50001;

const run = () => {
  setQueues([
    /* Already defined (bull) queues */
  ])
  // Or a single bull queue
  setQueues(/* Already defined bull queue */);
  let redisJson = JSON.parse(fs.readFileSync('./redis.json'))
  const queues = createQueues(redisOptions)

  const redis = queues.add(redisJson.name)

  redis.process(async (job, done) => {
    for (let i = 0; i <= 100; i++) {
      job.progress(i)
    }
    done()
  })

  app.use('/add', (req, res) => {
    redis.add({ title: req.query.title })
    res.json({ ok: true })
  })
  app.get('/change-redis', (req, res) => {
    redisJson.name = req.query.name
    fs.writeFileSync('./redis.json', JSON.stringify(redisJson))
    res.json({ ok: 'change redis' })
  })

  app.use('/ui', UI)
  app.listen(PORT, () => {
    console.log('Running on 3000...')
    console.log(`For the UI, open http://localhost:${PORT}/ui`)
    console.log('Make sure Redis is running on port 6379 by default')
    console.log('To populate the queue, run:')
    console.log(` curl http://localhost:${PORT}/add?title=Example`)
  })
}

run()
