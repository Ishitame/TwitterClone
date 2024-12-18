const { genSalt } = require("bcrypt");
const userModel = require("../models/userModel");
const flash=require('connect-flash')
const expressSession=require('express-session')
const bcyrpt=require('bcrypt')
require('dotenv').config
const jwt=require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET


module.exports.landingPageController=(req,res)=>{
    res.render("Front");

}
module.exports.registerPageController=(req,res)=>{
    res.render("Register",{error:req.flash("error")[0]});

}
module.exports.postregisterPageController=async (req,res)=>{
    let {username ,email,password}=req.body
    let user=await userModel.findOne({username})
    if(user){
        req.flash("error",'account already exists, please login');
        return res.redirect('/register')
    }

    await bcyrpt.genSalt(10,async function(err,salt){
       await  bcyrpt.hash(password,salt,async function (err,hash){
          let newUser=  await userModel.create(
                {
                    username ,email,password:hash
                }
            )
            user=newUser;

        })

    })
    
   res.redirect('/login')
}
module.exports.loginPageController=(req,res)=>{
    res.render('Login',{error:req.flash("error")[0]})
}
module.exports.ploginPageController= async (req,res)=>{
    let {username,password}=req.body
  
    let check = await userModel.findOne({username});
  
    if(!check){ req.flash("error",'account does not exists,please register');
    return res.redirect('/login')}
    
    bcyrpt.compare(password,check.password, async (err,result)=>{
        if(result)
        {
            let token=jwt.sign({username},'secret', { expiresIn: '1h' })
            res.cookie('token',token)
            const friends=check.following
   
            const sents=check.requests
            const done=check.sent
            let request=await userModel.find({username:{$ne:check.username},_id:{$in:sents}});
            let people=await userModel.find({username:{$ne:check.username},_id:{$nin:friends},_id:{$nin:sents},_id:{$nin:done}});
            res.render('Home',{user:check,people,request});
        }
        else 
        {
            req.flash("error",'Incorrect Credentials');
            return res.redirect('/login')   
        }
    })

    
}

module.exports.logoutprofilePageController=(req,res)=>{
    res.cookie("token","");
    res.redirect("/");
}
