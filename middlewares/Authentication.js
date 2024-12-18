const cookieParser=require("cookie-parser");
require('dotenv').config
const jwt=require('jsonwebtoken');
const userModel = require("../models/userModel");
const JWT_SECRET = process.env.JWT_SECRET


module.exports.isLoggedIn=async(req,res,next)=>{
    const token=req.cookies.token
    if(token)
    {
        jwt.verify(token,'secret',async function(err,decoded){
            let{username}=decoded;
            let user=await userModel.findOne({username})
            if(user)
            {
                req.user=user;
                next();
            }
            else
            {
                res.redirect("/");
            }
        } )
    }
    

   else {res.redirect("/")}
}