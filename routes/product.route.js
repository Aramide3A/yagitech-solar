const express = require('express')
const path = require('path')
const Products = require('../models/product.model')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,  path.join(__dirname, '..', 'public', 'images'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname.replace(/\.[^/.]+$/, "") + '-' + Date.now() + path.extname(file.originalname))
    }
})  
const upload = multer({ storage: storage })
const router = express.Router()


/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id: 
 *           type: string
 *           description: Auto Generated Id by database
 *         name:
 *           type: string
 *         price:
 *           type: Number
 *         specifications:
 *           type: string
 *         image:
 *           type: string
 *         category:
 *           type: string
 *           enum: [Solar Panel, Inverter, Batteries, Complete Solution]
*/

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all the products
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: An error occurred
*/
router.get('/products', async(req,res)=>{
    try {
        const all_products = await Products.find({})
        res.status(200).send(all_products)
    } catch (error) {
        res.status(500).send(error)
    }
})

/**
 * @swagger
 * /api/products/{categroy}:
 *   get:
 *     summary: Get a specific category of products
 *     description: Retrieve all the prodcuts of a particular category
 *     parameters:
 *       - name: category
 *         in: path
 *         required: true
 *         description: The catgeory of the products to return.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A specific posts
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: An error occurred
*/
router.get('/products/:category', async(req,res)=>{
    let category
    if (req.params.category === "complete"){
        category = "Complete Solution"
    }else{
        category = req.params.category
    }
    const all_products = await Products.find({category:category})
    res.status(200).send(all_products)
})

router.post('/products', upload.single('image'), async(req,res)=>{
    try {
        const {name,price,specification,category} = req.body
        const image = req.file.filename

        const product = new Products({
            name: name,
            price: price,
            specification: specification,
            category:category,
            image: image
        })
        await product.save()
        res.status(201).send(product)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router