const router= require ('express').Router();
const User= require('../package/User');
const bcrypt=require("bcrypt")

//Profile updation
router.put('/:id', async(req,res) => {
if(req.body.userId== req.params.id){
    if(req.body.password){
        const salt= await bcrypt.genSalt(15);
        res.body.password= await bcrypt.hash(req.body.password, salt)
    }
    try{
        const updateduser= await User.findByIdAndUpdate(req.params.id,{
            $set:req.body,
        },
        {new:true}
        );
        res.status(200).json(updateduser)
    } catch(err){
        res.status(500).json(err)
    }
 } else {
res.status(401).json("Kindly update your profile only")
    } 
});
module.exports=router;