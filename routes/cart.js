const router= require('express').Router();
const Cart= require('../package/Cart');

//To get the cart items
router.get("/cart", async(req,res) => {
    const user= req.user._id;
    try{
        const cart= await Cart.findOne({user});
        if(cart && cart.items.length>0){
            res.status(200).send(cart);
        } else{
            res.send(null);
        }
    } catch (error){
        res.status(500).send();
    }
});

// Add items in the cart 
router.post("/cart", async(req,res) => {
    const user= req.user._id;
    const{itemId, quantity}= res.body;
    try{
        const cart= await Cart.findOne({user});
        const item= await item.findOne({_id:itemId});
        if(!item){
            res.status(404).send({message:"Item Not Found"});
            return;
        } 
        const iPrice= item.price;
        const iName= item.name;

        // If cart is already exists for user
        if(cart) {
            const itemIndex=cart.directModifiedPaths.findIndex((item) => item.itemId == itemId);

            //heck whether product is exists or not
            if(itemIndex >-1){
                let product= cart.items[itemIndex];
                product.quantity +=quantity;
                cart.bill= cart.items.reduce((acc, curr) => {
                    return acc+ curr.quantity*curr.iPrice;
                }, 0)
                cart.items[itemIndex]=product;
                await cart.save();
                res.status(200).send(cart);
                } else {
                    cart.items.push({itemId,iName,quantity,iPrice});
                    cart.bill= cart.items.reduce((acc, curr) => {
                        return acc+curr.quantity*curr.iPrice;
                    }, 0)
                    await cart.save();
                    res.status(200).send(cart);
                }
        } else {

            //If no cart exists, create one 
            const newCart= await Cart.create({
                user,
                items:[{itemId, iName, quanity, iPrice}],
                bill:quantity*iPrice,
            });
                return res.status(201).send(newCart);
        }
    } catch(error) {
            console.log(error);
            res.status(500).send("Something went wrong");
    }
});

//To delete items from cart
router.delete("/cart/", async(req,res) => {
    const user= req.user._id;
    const itemId= req.query.itemId;
    try{
        let cart= await Cart.findOne({user});
        const itemIndex= cart.items.findIndex((item) => item.itemId == itemId);
        if(itemIndex > -1){
            let item= cart.items[itemIndex];
            cart.bill -= item.quantity*item.iPrice;
            if(cart.bill<0){
                cart.bill = 0
            }
            cart.items.splice(itemIndex, 1);
            cart.bill= cart.items.reduce((acc, curr) => {
                return acc+ curr.quantity*curr.iPrice;
            }, 0)
            cart= await cart.save();
            res.status(200).send(cart);
        } else {
            res.status(404).send("Item Not Found");
        }
    } catch(error){
        console.log(error);
        res.status(400).send();
    }
});
module.exports= router;