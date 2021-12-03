const mongoose = require('mongoose')

const Schema = mongoose.Schema

const peakSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  elevation: {
    type: String,
    required: true
  },
  length: {
    type: String,
    required: true
  },
  hike_time: {
    type: String,
    required: true
  },
  difficulty: {
    type: Number,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
}
)

module.exports = mongoose.model('Peak', peakSchema)
