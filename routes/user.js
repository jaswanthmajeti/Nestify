const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport  = require('passport');
const wrapAsync = require('../utils/wrapAsync');
const { saveRedirectUrl,validateUser,validateUpdateUser,isLoggedIn } = require('../middleware');
const userController = require('../controllers/users');
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
  .route('/signup')
  .get(userController.renderSignupForm)
  .post(validateUser,wrapAsync(userController.signup));


router
  .route('/login')
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true
    }),
    userController.login);



router.get('/logout',userController.logout);


router.get('/profile',userController.renderProfile);

router.get('/:userId/edit',userController.renderEditForm);

router.put('/:userId',isLoggedIn,upload.single('user[profilePic]'),validateUpdateUser,wrapAsync(userController.updateProfile));

module.exports = router;