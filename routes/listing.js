const express= require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const {isLoggedIn,isOwner,validateListing} = require('../middleware');
const listingController = require('../controllers/listings');
const multer  = require('multer')
const {storage} = require('../cloudConfig');


const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024  
    }
});


router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing));




router.get('/new',isLoggedIn,listingController.renderNewForm);

router.get("/search", wrapAsync(listingController.search));


router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing))
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing));



router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));





module.exports = router;