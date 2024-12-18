const express=require('express')
const db=require('./config/mongooseConfig');
const front = require('./routes/frontPage');
const profile = require('./routes/profilePage');
const flash=require('connect-flash')
const expressSession=require('express-session')
const cookieParser=require("cookie-parser");
const app=express();
app.set('view engine','ejs')
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "hjagshkncbhjakskzbchkj"
}));
app.use(flash());
app.use(cookieParser())
app.get('/post',(req,res)=>{

    res.render('Post2')
})
app.use('/',front)
app.use('/profile',profile)

app.listen(3000)