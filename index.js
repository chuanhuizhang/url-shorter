const Glue = require('glue')
const os = require('os')
const config = require('config')
const ejs = require('ejs')
const inert = require('inert')
const vision = require('vision')

const GOOD_OPTIONS = {
  ops: {
    interval: config.get('server.port')
  },
  reporters: {
    console: [
      {
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [
          {
            log: '*', response: '*', error: '*'
          }
        ]
      }, {
        module: 'good-console'
      },
      'stdout'
    ]
  }
}

const manifest = {
  server: {
    port: config.get('server.port')
  },
  register: {
    plugins: [
      {
        plugin: 'blipp',
        options: {}
      },
      {
        plugin: 'good',
        options: GOOD_OPTIONS
      },
      {
        plugin: './src'
      }
    ],
    options: {
      once: true
    }
  }
}

const options = {
  relativeTo: __dirname
}

const startServer = async function () {
  try {
    const server = await Glue.compose(manifest, options)
    await server.register(inert)
    await server.register(vision)

    server.views({
      engines: { ejs },
      relativeTo: __dirname,
      path: 'src/templates',
      layout: true
    })

    server.route({
      path: '/status',
      method: 'GET',
      config: {
        description: 'Provides health status of running server',
        auth: false,
        cache: false
      },
      handler() {
        return {
          running: true,
          uptime: process.uptime(),
          memeory: process.memoryUsage(),
          loadavg: os.loadavg(),
          droneId: process.pid
        }
      }
    })

    server.route({
      path: '/public/{param*}',
      method: 'GET',
      config: {
        description: 'Public directory',
        auth: false,
        cache: false
      },
      handler: {
        directory: {
          path: 'public'
        }
      }
    })

    server.route({
      path: '/',
      method: 'GET',
      config: {
        description: 'Home page',
        auth: false,
        cache: false
      },
      handler(request, h) {
        return h.view('home')
      }
    })
    await server.start()
    console.log(`Server started at: ${server.info.uri}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

startServer()
