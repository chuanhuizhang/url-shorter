const Joi = require('joi')
const Boom = require('boom')
const moment = require('moment')
const URL = require('./model')

const validate = {
  params: {
    shortID: Joi.string().required()
  }
}

function handler(request, h) {
  return new Promise((resolve, reject) => {
    URL.findOneAndUpdate({
      shortID: request.params.shortID
    }, {
      $inc: { visits: 1 },
      $set: { lastVisit: moment().toDate() }
    }, {
      new: true
    }, (err, url) => {
      if (err) return reject(Boom.badImplementation(err))
      if (!url) {
        return reject(Boom.notFound('URL not found'))
      }
      resolve(h.redirect(url.longURL))
    })
  })
}

module.exports = {
  description: 'Redirect to long url',
  validate,
  handler
}
