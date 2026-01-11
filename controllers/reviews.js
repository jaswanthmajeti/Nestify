const Review = require('../models/review');
const Listing = require('../models/listing');

module.exports.createReview = async(req,res)=>{
    let {id} = req.params;
    req.body.review.owner = req.user._id;
    const newReview = new Review(req.body.review);
    
    let listing = await Listing.findById(id);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","new review created successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.updateOne({_id:id},{$pull : {reviews : reviewId}});
    req.flash("success","review deleted");
    res.redirect(`/listings/${id}`)
};