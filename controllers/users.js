const User = require('../models/user');


module.exports.renderSignupForm = (req,res)=>{
    res.render('users/signup');
};

module.exports.signup = async(req,res)=>{
    try{
        let registeredUser = await User.register(new User(req.body.user),req.body.user.password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Nestify");
            res.redirect('/listings');
        })

    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }

};


module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login');
};

module.exports.login = (req,res)=>{
    req.flash("success","You logged into Nestify!");
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged out successfully.");
        res.redirect("/listings");
    })
};