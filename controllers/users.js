const User = require('../models/user');
const Listing = require('../models/listing');
const Review = require('../models/review');
const { cloudinary } = require('../cloudConfig');


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
        req.flash("success","logged out successfully");
        res.redirect("/listings");
    })
};

module.exports.renderProfile = async(req,res) =>{
    let user = await User.findById(req.user._id);
    let listings = await Listing.find({owner:user._id});
    let listingsCount = listings.length;
    let reviews = await Review.find({owner:user._id});
    let reviewsCount = reviews.length;
    res.render('users/profile.ejs',{user,listingsCount,reviewsCount});
}

module.exports.renderEditForm = async (req,res)=>{
    let {userId} = req.params;
    let user = await User.findById(userId);
    res.render('users/edit.ejs',{user});
}

module.exports.updateProfile = async(req,res)=>{
    let {userId} = req.params;
    let {username,email,password} = req.body.user;
    
    let user = await User.findById(userId);
    
    let updateData = {
        username: username,
        email: email
    };

    if(req.file){
        // Delete old profile pic from Cloudinary if it exists
        if(user.profilePic){
            try{
                // Extract public_id from Cloudinary URL
                // URL format: https://res.cloudinary.com/cloud_name/image/upload/v123/public_id.jpg
                let urlParts = user.profilePic.split('/');
                let publicIdWithExtension = urlParts[urlParts.length - 1];
                let publicId = publicIdWithExtension.split('.')[0];
                
                // Delete from Cloudinary and wait for completion
                await cloudinary.uploader.destroy(publicId);
            }
            catch(err){
                console.log("Error deleting old profile pic from Cloudinary:", err);
            }
        }

        updateData.profilePic = req.file.path;
    }

    user = await User.findByIdAndUpdate(userId, updateData, {runValidators:true, new:true});

    if(password && password.trim() !== ""){
        user.setPassword(password);
        await user.save();
    }

    // Re-authenticate user to refresh session with updated data
    req.login(user, (err)=>{
        if(err){
            req.flash("error","Error updating profile");
            return res.redirect('/profile');
        }
        req.flash("success","Profile Updated Successfully");
        res.redirect('/profile');
    });
}