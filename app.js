const app = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('./models/user.js');

mongoose.connect('mongodb://localhost/auth_demo');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({
    secret: 'I am learning NodeJS, it makes me happy',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
    res.render('homePage');
});

app.get('/profile', alreadyLoggedIn, (req, res) => {
    res.render('profilePage');
});
app.get('/register', (req, res) => {
    res.render('registerPage');
});

app.get('/login', (req, res) => {
    res.render('loginPage');
});

app.post('/login', passport.authenticate("local", {
    successRedirect: '/profile',
    failureRedirect: '/login'
}), (req, res) => { });

app.post("/register", (req, res) => {
    req.body.username
    req.body.password
    User.register(new User({
        username: req.body.username
    }), req.body.password, (err, data) => {
        if (!err) {
            passport.authenticate("local")(req, res, () => {
                res.redirect("profile");
            });
        } else {
            console.log(err);
            return res.render('registerPage');
        }
    });

});

app.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

app.get('/profile', (req, res) => {
    res.render('profilepage');
});

function alreadyLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
};

app.listen(3000, () => {
    console.log("App is working on 3000 number of port!");
})