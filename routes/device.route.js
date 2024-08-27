const express = require('express')
const devices = require('../models/device.model')
const { Console } = require('console')
const router = express.Router()


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
        res.status(200).send(totalUsage)
    } catch (error) {
        return res.status(400).json({error: "Something Went Wrong"});
    }
})

module.exports=router