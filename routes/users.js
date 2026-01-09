const express = require('express');
const router = express.Router();
const passport= require('passport')
const User = require('../models/user');

router.get('/register',  (req, res) => {
    res.render('users/register');
})

router.post('/register', async (req, res,next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success','welcome');
            res.redirect('/campgrounds');
        });


    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }

});
router.get('/login',(req,res)=>{
    res.render('users/login.ejs')
});
router.post('/login',passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}),
    (req, res) => {
        req.flash('success', 'Welcome');
        const redirectUrl = req.session.returnTo || '/campgrounds';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
})
router.get('/logout', (req, res,next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    req.flash('success', 'you are logged out!');
    res.redirect('/campgrounds');
});
});
module.exports = router;

