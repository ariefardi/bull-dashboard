import React from 'react'
import Queue from './Queue'
import RedisStats from './RedisStats'
import Header from './Header'
import useStore from './hooks/useStore'

export default function App({ basePath }) {
  const {
    state,
    selectedStatuses,
    setSelectedStatuses,
    retryJob,
    retryAll,
    cleanAllDelayed,
    cleanAllFailed,
    changeQueue,
  } = useStore(basePath)
  let queueName = ''
  if (state.data) {
    queueName = state.data.queues[0].name
  }
  return (
    <>
      <Header />
      <main>
        {state.loading ? (
          'Loading...'
        ) : (
          <>
            {/* <RedisStats stats={state.data.stats} /> */}
            {state.data.redisQueues.map(value => {
              if (queueName === parsedButton(value)) {
                return (
                  <button
                    onClick={() => changeQueue(parsedButton(value))}
                    className="button2"
                  >
                    {parsedButton(value)}
                  </button>
                )
              } else {
                return (
                  <button
                    onClick={() => changeQueue(parsedButton(value))}
                    className="button1"
                  >
                    {parsedButton(value)}
                  </button>
                )
              }
            })}
            {state.data.queues.map(queue => (
              <Queue
                queue={queue}
                key={queue.name}
                selectedStatus={selectedStatuses[queue.name]}
                selectStatus={setSelectedStatuses}
                retryJob={retryJob(queue.name)}
                retryAll={retryAll(queue.name)}
                cleanAllDelayed={cleanAllDelayed(queue.name)}
                cleanAllFailed={cleanAllFailed(queue.name)}
              />
            ))}
          </>
        )}
      </main>
    </>
  )
}

const parsedButton = value => {
  let split = value.split(':')
  return split[1]
}
