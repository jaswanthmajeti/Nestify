const express= require('express');
const router = express.Router({mergeParams:true});
const Listing = require('../models/listing');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync');
const {isLoggedIn,validateReview,isreviewOwner} = require('../middleware');
const reviewController = require('../controllers/reviews');



router.post('/',isLoggedIn,validateReview,wrapAsync(reviewController.createReview));


router.delete('/:reviewId',isLoggedIn,isreviewOwner,reviewController.destroyReview);

module.exports = router;