const express=require('express');
const { mainprofilePageController, followprofilePageController, acceptprofilePageController, declineprofilePageController} = require('../controllers/profilePageController');
const { isLoggedIn } = require('../middlewares/Authentication');


const profile=express.Router()

profile.get("/:users",isLoggedIn,mainprofilePageController)

profile.post("/request/:users",isLoggedIn,followprofilePageController)

profile.post("/accept-request/:users",isLoggedIn,acceptprofilePageController)

profile.post("/decline-request/:users",isLoggedIn,declineprofilePageController)




module.exports=profile;


