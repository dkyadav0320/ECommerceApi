const router= require('express').Router();
const User=require('../package/User');
const bcrypt= require ("bcrypt");

//API Registration 
router.post('/register', async(req,res) =>{
    try{
const salt= await bcrypt.genSalt(15);
const hassPswd= await bcrypt.hash(req.body.password, salt)
const newUser= new User({
    username:req.body.username,
    email:req.body.email,
    password:hassPswd
});
const user= await newUser.save();
console.log(user);
res.status(200).json(user)
    }
    catch(err){
        res.status(500).json(err)
    }
});
 
//Api for Login
router.post('/login', async(res, req) =>{
    try{
        const user=await User.findOne({email:req.body.email})
        !user && res.status(400).json("Wrong Credentials");
        const validated= await bcrypt.compare(res.body.password, user.password)
        !validated && res.status(422).json("Password is not matched, try again!")
        const{password, ...others}= user._doc       //to keep the password from storing it in databse
        res.status(200).json(others);
    } catch(err){
        res.status(500).json(err)     //here it reflects error while trying to login the user 
    }
});
module.exports= router;