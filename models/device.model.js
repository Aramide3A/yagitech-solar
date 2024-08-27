const mongoose = require('mongoose')

const schema= mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    power_rating : {
        type: Number,
        required: true
    }
})

const devices = mongoose.model('Device', schema)

module.exports = devices