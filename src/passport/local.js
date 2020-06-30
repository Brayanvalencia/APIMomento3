const passport= require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/user');
const user = require('../models/user');
const { use } = require('passport');

passport.serializeUser((user, done) =>{
    done(null, user.id);
});

passport.deserializeUser(async(id, done) =>{
    const user = await User.findById(id);
    done(null, user);
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {

    const user = await User.findOne({email: email});
    if (user) {
        return done(null, false, req.flash('SignupMessage', 'The Email is already taken.'));
    } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        await newUser.save();
        done(null, newUser);
    }

    
}));

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = await User.findOne({email: email})
    if(!user) {
        return done(null, false, requ.flash('signinMessage', 'No User fond.'))
    }
    if(!user.comparePassword(password)) {
        return done(null, false, req.flash('signinMessage','Password Incorrect'))
    }
    done(null, user)
}));
