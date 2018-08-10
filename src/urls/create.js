const config = require('config')
const Joi = require('joi')
const Boom = require('boom')
const ShortID = require('shortid')
const halson = require('halson')
const URL = require('./model')

const validate = {
  payload: {
    longURL: Joi.string().trim().uri().required()
  }
}

const pre = [
  {
    assign: 'url',
    method: (request) => {
      return new Promise((resolve, reject) => {
        URL.findOne({ longURL: request.payload.longURL }, (err, doc) => {
          if (err) return reject(Boom.badImplementation(null, 'sample'))
          return resolve(doc)
        })
      })
    }
  }
]

const response = Joi.object({
  longURL: Joi.string().required(),
  shortID: Joi.string().required(),
  createdAt: Joi.date().required()
}).options({
  stripUnknown: true
})

function handler(request, h) {
  // If url exist in database, return directly with 200
  if (request.pre.url) {
    return h.response(request.pre.url)
  }

  const url = new URL({
    longURL: request.payload.longURL,
    shortID: ShortID.generate()
  })

  return new Promise((resolve, reject) => {
    url.save((err) => {
      if (err) return reject(Boom.badImplementation(err, 'sample'))
      resolve(h.response(url).code(201))
    })
  })
}

module.exports = {
  description: 'Creates a short url based on given url',
  validate,
  pre,
  handler,
  response: {
    modify: true,
    schema: (value) => {
      const result = Joi.validate(value.toObject(), response)
      if (result.error) throw Boom.badImplementation(null, 'sample')
      return halson(result.value)
        .addLink('self', `${config.server.origin}/v1.0/urls/${value._id}`)
        .addLink('shortURL', `${config.server.origin}/${value.shortID}`)
    }
  }
}
