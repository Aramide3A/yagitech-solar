const express = require('express')
const devices = require('../models/device.model')
const { Console } = require('console')
const Products = require('../models/product.model')
const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Device:
 *       type: object
 *       properties:
 *         id: 
 *           type: string
 *           description: Auto Generated Id by database
 *         name:
 *           type: string
 *         power rating:
 *           type: Number
*/

/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: Get all devices
 *     description: Retrieve a list of all the devices and their power ratings in 'Kw'
 *     responses:
 *       200:
 *         description: A list of devices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Device'
 *       500:
 *         description: An error occurred
*/
router.get('/devices', async(req,res)=>{
    const all_products = await devices.find({}).sort({name: 1})
    res.status(200).send(all_products)
})

router.post('/devices', async(req,res)=>{
    const {name, power_rating} = req.body
    const device = new devices({
        name : name,
        power_rating: power_rating
    })
    await device.save()
    res.status(200).send(device)
})

/**
 * @openapi
 * '/api/calculate':
 *  post:
 *     summary: Calculate total kW usage and recommend products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceId
 *               - hoursPerDay
 *             properties:
 *               deviceId:
 *                 type: string
 *               hoursPerDay:
 *                 type: string
 *     responses:
 *       200:
 *         description: An object containing kW usage for weekly, monthly, and yearly, and a list of recommended products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 TotalKwUsage:
 *                   type: object
 *                   properties:
 *                     weekly:
 *                       type: number
 *                     monthly:
 *                       type: number
 *                     yearly:
 *                       type: number
 *                 RecommendedProducts:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server Error
 */

router.post('/calculate', async(req,res)=>{
    const appliances = req.body.appliances
    if (!appliances || !Array.isArray(appliances)) {
        return res.status(400).json({ error: 'Invalid input: appliances should be an array.' });
    }

    try {
        const applianceId = appliances.map(a => a.id) 

        const findAppliances = await devices.find({_id: {$in: applianceId}}).exec()

        let totalKwUsage = 0
        findAppliances.forEach(element => {
            id = element._id.toString()
            const appliance = appliances.find(a => a.id  === id)
            const usage = appliance.hoursPerDay
            let KwUsage  = element.power_rating * usage 
            totalKwUsage += KwUsage
        })
        const totalUsage = {
            "weekly": totalKwUsage * 7,
            "monthly": totalKwUsage * 30,
            "yearly": totalKwUsage * 365,
        }
        let recommended_products
        // if (totalKwUsage * 30 < 200){
        //     recommended_products = await Products.find({power_rating: {$gte: 1.5}})
        // }
        recommended_products = await Products.find()
        res.status(200).send({
            'Total Kw Usage': totalUsage,
            'Recommended Products': recommended_products
        })
    } catch (error) {
        return res.status(500).json({error: "Something Went Wrong"});
    }
})

module.exports=router