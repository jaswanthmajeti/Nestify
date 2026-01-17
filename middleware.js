const Listing = require('./models/listing');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');
const {listingSchema,reviewSchema,userSchema,updateUserSchema} = require('./schema');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in!");
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let data = await  Listing.findById(id);
    if(!req.user._id.equals(data.owner._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    let result = listingSchema.validate(req.body);
    if(result.error){
        const errMsg = result.error.details.map((el)=> el.message).join(",");
        next(new ExpressError(400,errMsg));
    }
    next();
}

module.exports.validateReview = (req,res,next)=>{
    let result = reviewSchema.validate(req.body);
    if(result.error){
        const errMsg = result.error.details.map((el)=> el.message).join(",");
        return next(new ExpressError(400,errMsg));
    }
    next();
}

module.exports.validateUser = (req,res,next)=>{
    let result = userSchema.validate(req.body);
    if(result.error){
        const errMsg = result.error.details.map((el)=> el.message).join(",");
        next(new ExpressError(400,errMsg));
    }
    next();
}

module.exports.validateUpdateUser = (req,res,next)=>{
    let result = updateUserSchema.validate(req.body);
    if(result.error){
        const errMsg = result.error.details.map((el)=> el.message).join(",");
        return next(new ExpressError(400,errMsg));
    }
    next();
}



module.exports.isreviewOwner = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.owner.equals(req.user._id)){
        req.flash("error","You can't delete this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}