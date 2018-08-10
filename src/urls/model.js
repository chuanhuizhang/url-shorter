const mongoose = require('mongoose')
const moment = require('moment')

const URL_SCHEMA = new mongoose.Schema({
  longURL: { type: String, required: true },
  shortID: { type: String, required: true },
  visits: { type: Number, required: true, default: 0 },
  lastVisit: { type: Date },
  createdAt: { type: Date, required: true, default: moment().toDate() }
}, { collection: 'urls' })

URL_SCHEMA.index({ longURL: 1, shortID: 1 })

module.exports = mongoose.model('URL', URL_SCHEMA)
