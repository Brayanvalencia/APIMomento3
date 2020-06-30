const express = require('express');
const engine = require('pug');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

//Initializations
const app = express();
require('./database');
require('./passport/local');

//setings
app.set("views", path.join(__dirname ,"views"));
app.set("view engine", "ejs")
app.set('port', process.env.PORT || 8080);

//middlewares
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'esunsecretodesession',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    app.locals.signupMessage = req.flash('signupMessage');
    app.locals.signinMessage = req.flash('signinMessage');
    next();
});

//Routes
app.use('/', require('./routes/routes'));

//Inicio del servidor
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});