const express = require("express")
const Flutterwave = require("flutterwave-node-v3")
const Order = require("../package/Order")
const Cart = require("../package/Cart")
const User = require("../package/User")
const Auth = require("../middleware/auth")


const router = new express.Router()

const flw = new Flutterwave(process.env.FLUTTERWAVE_V3_PUBLIC_KEY, process.env.FLUTTERWAVE_V3_SECRET_KEY)

//Get orders from Users

router.get('/orders', Auth, async (req, res) => {
    const owner = req.user._id;
    try {
        const order = await Order.find({ owner: owner }).sort({ date: -1 });
        if(order) {
            return res.status(200).send(order)
        }
        res.status(404).send('No Orders Found')
    } catch (error) {
        res.status(500).send()
    }
})

// To Checkout from order section
router.post('/order/checkout', Auth, async(req, res) => {
    try {
        const owner = req.user._id;
        let payload = req.body
        

        //To find Cart and User before placing the order
        let cart = await Cart.findOne({owner})
        let user = req.user
        if(cart) {
            
        payload = {...payload, amount: cart.bill, email: user.email}
            const response = await flw.Charge.card(payload)
           // console.log(response)
            if(response.meta.authorization.mode === 'pin') {
                let payload2 = payload
                payload2.authorization = {
                    "mode": "pin",
                    "fields": [
                        "pin"
                    ],
                    "pin": 3310
                }
                const reCallCharge = await flw.Charge.card(payload2)

                const callValidate = await flw.Charge.validate({
                    "otp": "12345",
                    "flw_ref": reCallCharge.data.flw_ref
                })
                console.log(callValidate)
                if(callValidate.status === 'success') {
                    const order = await Order.create({
                        owner,
                        items: cart.items,
                        bill: cart.bill
                    })
                    // To Delete Cart
                    const data = await Cart.findByIdAndDelete({_id: cart.id})
                    return res.status(201).send({status: 'Payment Successful', order})
                } else {
                    res.status(400).send('Payment Failed')
                }
            }
            if( response.meta.authorization.mode === 'redirect') {

                let url = response.meta.authorization.redirect
                open(url)
            }

           // console.log(response)

        } else {
            res.status(400).send('No Cart found')
        }
    } catch (error) {
        console.log(error)
        res.status(400).send('Invalid Request')
    }
})

module.exports = router
