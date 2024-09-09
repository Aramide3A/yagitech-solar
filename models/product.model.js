const { default: mongoose } = require("mongoose");

const schema =mongoose.Schema({
    name  : String,
    price : Number,
    power_rating : Number,
    specification : String,
    image: String,
    category : {
        type: String,
        enum : ['Solar Panel', 'Inverter', 'Batteries', 'Complete Solution']
    }
})

const Products = mongoose.model('Product', schema)

module.exports = Products