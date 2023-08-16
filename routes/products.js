const router= require('express').Router();
const Product= require('../package/Product');

//To Create the products
router.post('/create/new', async(req,res) => {
    const newProduct= newProduct(req,res);
    try{
        const savedProduct= await newProduct.save();
        res.status(200).json(savedProduct)
    } catch(error){
        res.status(500).json(error)
    }
});

//Search Api to get the products
router.get("/", async(req,res) => {
    const qNew=req.query.new;
    const qCategory=req.query.category;
    try{
        let products;
        if(qNew){
            products= await Products.find().sort({createAt:-1}).limit(1);
        }
        else if (qCategory){
            products= await Product.find({
                categories:{
                    $in:[qCategory],
                },
            })
        }else{
            products=Product.find();
        }
        res.status(200).json(products);
    } catch(error){
        res.status(500),json(error);
    }
})
module.exports=router;
