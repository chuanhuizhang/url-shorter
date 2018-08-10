const create = require('./create')
const load = require('./load')
const list = require('./list')

module.exports = [
  {
    path: '/v1.0/urls',
    method: 'POST',
    config: create
  },
  {
    path: '/v1.0/urls',
    method: 'GET',
    config: list
  },
  {
    path: '/{shortID}',
    method: 'GET',
    config: load
  }
]
