if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
console.log(process.env.SECRET)

const express = require('express');
const path= require('path')
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require ('method-override')
const ejsMate = require('ejs-mate')
const flash = require('connect-flash')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const {MongoStore} = require('connect-mongo');


const{campgroundSchema, reviewSchema}= require('./schemas.js');



const AppError=require('./utilities/AppError');
const passport= require('passport')
const LocalStrategy= require('passport-local')
const User = require('./models/user')




const asyncatch =require('./utilities/asyncatch');
const Campground = require('./models/campground')
const Review = require('./models/review');
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelpcamp';
async function main() {
    await mongoose.connect(dbUrl);
    console.log('MongoDB is also Connected!');
}

main().catch(err => console.log(err));

const app = express();




app.engine('ejs', ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static('public'));
//todo: fix me app.use(mongoSanitize());

app.use(
    helmet({
        contentSecurityPolicy: false
    })
);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60 // time period in seconds
});
store.on('error', function(error) {
    console.log('SESSION STORE ERROR', error);
});



 const sessionConfig = {
     store:store,
     name:'jazoh',
     secret: process.env.SESSION_SECRET || 'the secret',
     resave: false,
     saveUninitialized: true,
     cookie:{
         expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
         maxAge: 1000 * 60 * 60 * 24 * 7,
         httpOnly: true
     }
 }



app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



passport.use(new LocalStrategy(User.authenticate()));



passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
console.log("start")

app.use((req, res, next) => {
    console.log("MIDDLEWARE IS RUNNING");
    res.locals.currentUser = req.user || null
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})
app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);

app.get('/', (req,res) =>{
   console.log("home")
    res.render('home')
});




// app.get('/makecamp',async (req,res) =>{
//     const camp = new Campground({title:'my camp', description:'cheap camp'})
//     await camp.save()
//     res.send(camp);
//
// })



app.all(/.*/, (req, res, next) => {
    next(new AppError('It was not Found!', 404))
})

app.use((err,req,res,next)=>{
const {status= 500, message = 'something happened'}=err;
    res.status(status).render('error',{err})
})



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});