const express = require('express')
const mongoose  = require('mongoose')
const app = express()
require('dotenv').config()
const devicesRouter =require('./routes/device.route')
const productsRouter =require('./routes/product.route')
const swaggerSpec = require('./swagger')
const swaggerUI = require('swagger-ui-express')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use('/api', [devicesRouter,productsRouter])
app.use('/images', express.static('public/images'))
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));


mongoose.connect(process.env.MongoDB_URI)
.then(console.log('Database connected successfully'))
.catch(console.error())

const port = process.env.PORT || 3000
app.listen(3000, ()=>{
    console.log(`App running on port ${port}`)
})