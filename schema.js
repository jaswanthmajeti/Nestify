const Joi = require('joi');

module.exports.listingSchema  = Joi.object({
    listing:Joi.object(
        {
            title:Joi.string().trim().required(),
            description:Joi.string().trim().required(),
            image:Joi.string().allow("",null),
            country:Joi.string().trim().required(),
            location:Joi.string().trim().required(),
            price:Joi.number().integer().min(0).required()
        }
    ).required()
});


module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        comment:Joi.string().required()
    }).required()
})

module.exports.userSchema = Joi.object({
    user:Joi.object({
        username: Joi.string().trim().min(3).required(),
        email: Joi.string().trim().required().email(),
        password: Joi.string().trim().min(8).required(),
    }).required()
});