const _ = require('lodash')
const config = require('config')
const Joi = require('joi')
const Boom = require('boom')
const halson = require('halson')
const URL = require('./model')

const validate = {
  query: {
    sort: Joi.string().regex(/^(visits|createdAt|[,-])+$/),
    limit: Joi.number().integer()
      .positive().max(100)
      .default(25),
    skip: Joi.number().integer().min(0).default(0)
  }
}

function handler(request, h) {
  const sort = request.query.sort ? _.chain(request.query.sort).split(',').reduce((result, value) => {
    if (_.startsWith(value, '-')) {
      value = _.trimStart(value, '-')
      result[value] = -1
      return result
    }
    result[value] = 1
    return result
  }, {}).value() : {}

  return new Promise((resolve, reject) => {
    URL.find({}, {
      _id: 0,
      shortID: 1,
      visits: 1,
      lastVisit: 1
    }).sort(sort)
      .skip(request.query.skip)
      .limit(request.query.limit)
      .exec((err, users) => {
        if (err) return reject(Boom.badImplementation(null, 'sample'))
        resolve(h.response(users))
      })
  })
}

module.exports = {
  description: 'List url with the query given',
  validate,
  handler,
  response: {
    modify: true,
    schema: (urls, options) => {
      const query = _.reduce(options.context.query, (result, val, key) => {
        result = result ? `${result}&` : '?'
        return `${result}${key}=${val}`
      }, '')

      return halson({
        _embeded: {
          urls: urls.map((url) => {
            return halson(url.toObject())
              .addLink('shortURL', `${config.server.origin}/${url.shortID}`)

          })
        }
      }).addLink('self', `${config.server.origin}/v1.0/urls${query}`)
    }
  }
}
