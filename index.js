const express = require("express")
const mongoose =require("mongoose")
const dotenv = require("dotenv")
const PORT = process.env.PORT || 5000;
const authRoute= require('./routes/auth.js')
const userRoute= require('./routes/users.js')
const productRoute= require('./routes/products.js')
const cartRoute= require('./routes/cart.js')
const orderRoute= require('./routes/orders.js')

dotenv.config();
const app=express();
mongoose.connect(process.env.MONGO_DB_URL)
.then(()=> console.log("MongoDB connection is successfull!"))
.catch((err)=> {
    console.log(err);
    
});
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("api/products", productRoute);
app.use("api/cart", cartRoute);
app.use("api/orders", orderRoute);

app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
})
