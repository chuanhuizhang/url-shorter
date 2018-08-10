const _ = require('lodash')
const config = require('config')
const mongoose = require('mongoose')

const URLs = require('./urls')

const pkg = require('../package.json')

function initMongo(mongoUri) {
  mongoose.connect(mongoUri, { autoReconnect: true })

  mongoose.connection.on('error', function (error) {
    console.log('mongo server connection', error)
    mongoose.disconnect()
  })

  mongoose.connection.on('connected', function () {
    console.log('MongoDB connected!')
  })

  mongoose.connection.once('open', function () {
    console.log(`Database connected to ${mongoUri}`)
  })

  mongoose.connection.on('disconnected', function () {
    console.log('disconnected with mongo server')
    initMongo(mongoUri)
  })

  mongoose.connection.on('reconnect', function () {
    console.log('reconnecting')
  })
}

exports.plugin = {
  async register(server) {
    initMongo(config.get('db.uri'))
    server.decorate('server', 'mongoose', mongoose)
    server.decorate('request', 'mongoose', mongoose)

    server.route(_.flatten([
      URLs.routes
    ]))
  },
  pkg
}
