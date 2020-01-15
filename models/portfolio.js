

const mongoose = require('mongoose')

const portfolioSchema = new mongoose.Schema({
    content:String,
    technology:String,
    type:String,
    info:String,
    votes:Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
})
portfolioSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Portfolio', portfolioSchema)
