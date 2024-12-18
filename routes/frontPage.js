const express=require('express');
const { landingPageController, registerPageController, postregisterPageController, loginPageController, ploginPageController, logoutprofilePageController } = require('../controllers/frontPageController');


const front=express.Router();

 front.get('/',landingPageController)
 front.get('/register',registerPageController)
 front.post('/pregister',postregisterPageController)
 front.get('/login',loginPageController)
 front.post('/plogin',ploginPageController)
front.get('/logout',logoutprofilePageController)
module.exports=front;