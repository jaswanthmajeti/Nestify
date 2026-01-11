const express = require('express');
const mongoose = require('mongoose');
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const app = express();
const ExpressError = require('./utils/ExpressError');
const listingRouter = require('./routes/listing');
const reviewRouter = require('./routes/review');
const userRouter = require('./routes/user');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);

const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
        secret: process.env.SESSION_SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.showSearchbox = false;
    next();
});

async function main(){
    try{
        await mongoose.connect(process.env.ATLASDB_URL);
    }
    catch(err){
        console.error(err);
    }
}

main();

app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);

app.all('/*spalt', (req, res, next) => {
    next(new ExpressError(404, "Page not found")); 
});

app.use((err, req, res, next) => {
    let {status = 500, message = "Some error occured"} = err;
    res.status(status).render("error", {err});
});

app.listen(process.env.PORT || 8080, () => {
    console.log(`Server started listening to port ${process.env.PORT || 8080}`);
});