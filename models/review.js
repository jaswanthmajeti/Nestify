const mongoose = require("mongoose");
const User= require('./user');

const reviewSchema = new mongoose.Schema({
    comment:{
        type:String,
        // required:true
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
})

const Review = mongoose.model("Review",reviewSchema);

module.exports = Review;