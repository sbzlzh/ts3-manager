const socket = {}

socket.init = server => {
  const io = require('socket.io')(server)
  const crypto = require('crypto')
  const jwt = require('jsonwebtoken')
  const {TeamSpeak} = require('ts3-nodejs-library')

  const {logger} = require('./utils')

  // generates a random key for encrypting the jsonwebtoken
  const secret = process.env.NODE_ENV === 'development' ? '1234' : crypto.randomBytes(256).toString('base64')

  // Check if the TeamSpeak object was created.
  const checkTSConnection = instance => {
    if(instance instanceof TeamSpeak) {
      return
    } else {
      return new Error('Something went wrong. Please login again')
    }
  }

  const registerEvents = (instance, logger, socket) => {
    instance.on('error', err => {
      logger.error(err.stack)

      socket.emit('teamspeak_error', err.message)
    })
    instance.on('flooding', () => logger.warn('Flooding'))
    instance.on('debug', data => {
      if(data.type === 'send') logger.info(data.data)
    })
    instance.on('close', () => {
      logger.info('ServerQuery connection closed')

      instance.removeAllListeners()
    })
  }

  // Send the response from the ServerQuery back to the frontend.
  const handleResponse = (response, fn) => {
    // By default socket.io converts the object to JSON and parses it on the client side automatically to a javascript object again.
    // Sometimes the response contains properties which are undefined. These properties would be removed because JSON have no value "undefined".
    // Because of that, all undefined properties are converted to "null" before they are emittet to the ui.
    response = JSON.stringify(response, (k, v) => v === undefined ? null : v)

    fn(JSON.parse(response))
  }

  // Send an error back to the frontend.
  const handleError = (err, fn) => {
    fn({message: err.message, ...err})
  }

  // When the client is connected to the server.
  io.on('connection', async socket => {
    let ip = socket.client.conn.remoteAddress
    let token = socket.handshake.query.token
    let log = logger.child({client: ip})
    let ServerQuery = undefined

    log.info('connected to socket.io')

    // Try to reconnect to the TeamSpeak ServerQuery if a client sends a token.
    if(token) {
      try {
        let decoded = jwt.verify(token, secret)

        ServerQuery = await TeamSpeak.connect(decoded)
        await ServerQuery.execute('use', {sid: 1})

        registerEvents(ServerQuery, log, socket)
      } catch(err) {
        socket.emit('teamspeak_error', err.message)
      }
    }

    // Check on every request if the TeamSpeak instance was created.
    socket.use((packet, next) => {
      if(packet[0] === 'teamspeak_connect') return next()

      next(checkTSConnection(ServerQuery))
    })

    // Connect to the ServerQuery and try to login.
    socket.on('teamspeak_connect', async (options, fn) => {
      try {
        ServerQuery = await TeamSpeak.connect(options)

        token = jwt.sign(options, secret)

        registerEvents(ServerQuery, log, socket)

        fn({token})
      } catch(err) {
        fn(err.message)
      }
    })

    // Send command to the ServerQuery. The parameters and options are optional.
    socket.on('execute', async (query, fn) => {
      let {command, params, options} = query

      try {
        let response = await ServerQuery.execute(command, params, options)

        handleResponse(response, fn)
      } catch(err) {
        handleError(err, fn)
      }
    })

    // Create a snapshot and send it back to the client.
    socket.on('createsnapshot', async fn => {
      try {
        let response = await ServerQuery.createSnapshot()

        handleResponse(response, fn)
      } catch(err) {
        handleError(err, fn)
      }
    })

    // Get the snapshot file and restore it.
    socket.on('deploysnapshot', async (snapshot, fn) => {
      try {
        // (Re)encoding the sended string (snapshot) to base64.
        // This prevents crashing the sever if an invalid file is uploaded.
        let verifiedSnapshot = Buffer.from(snapshot.toString(), 'base64').toString('base64')
        let response = await ServerQuery.deploySnapshot(verifiedSnapshot)

        handleResponse(response, fn)
      } catch(err) {
        handleError(err, fn)
      }
    })

    // When the client disconnects from the server.
    // Try to quit the connection to the ServerQuery, if the client closed the connection without logging out properly.
    socket.on('disconnect', async () => {
      if(ServerQuery instanceof TeamSpeak) {
        try {
          await ServerQuery.execute('quit')
        } catch(err) {
          //log.error(err.message)
        }
      }
    })
  })
}

module.exports = socket