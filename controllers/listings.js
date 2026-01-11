const Listing = require('../models/listing');

module.exports.index =  async(req,res)=>{
    let data = await Listing.find();
    res.render('listings/index',{data,showSearchbox:true});
}

module.exports.renderNewForm = (req,res)=>{
    res.render('listings/new');
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id).populate({path:"reviews",populate:{path:"owner"}}).populate('owner');
    if(!data){
        req.flash("error","Listing you requested doesn't exist");
        res.redirect('/listings');
    }
    else{
        res.render('listings/show',{data,reviews: data.reviews,owner:data.owner});
    }
};

module.exports.createListing = async (req,res,next)=>{
    let {listing} = req.body;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url:req.file.path,filename:req.file.filename};
    await newListing.save();
    req.flash("success","New listing created successfully");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id).populate("owner");
    if(!data){
        req.flash("error","Listing you requested doesn't exist");
        res.redirect('/listings');
    }
    else{
        let originalImageUrl = data.image.url.replace("/upload", "/upload/h_200,w_250");
        res.render('listings/edit',{data,originalImageUrl});
    }
};

module.exports.updateListing = async(req,res)=>{
    let {id}  = req.params;
    let { listing } = req.body;
    let updatedListing = await Listing.findByIdAndUpdate(id,listing,{runValidators:true});
    if(typeof req.file !== "undefined"){
        let url= req.file.path;
        let filename= req.file.filename;
        updatedListing.image = {url,filename};
        await updatedListing.save();
    }
    req.flash("success","Listing updated successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted successfully.");
    res.redirect('/listings');
};

module.exports.search = async (req, res) => {
    let { destination } = req.query;

    if (!destination || destination.trim().length === 0) {
      return res.redirect("/listings");
    }

    destination = destination.trim();
    //Search query (case-insensitive, partial match)
    const listings = await Listing.find({
      $or: [
        { location: { $regex: destination, $options: "i" } },
        { country: { $regex: destination, $options: "i" } },
        { title: { $regex: destination, $options: "i" } }
      ]
    });

    res.render("listings/index", { data:listings});
}