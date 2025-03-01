const express = require("express");
const router = express.Router();
const { check,body } = require('express-validator');
const driverAuthController = require("./../controllers/driverAuthController");
// const rideController=require('./../controllers/rideController');
// const driverController=require('./../controllers/driverController');



router.post("/signup", [
    check('phoneNumber')
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(/^\+91[0-9]{10}$/)
        .withMessage('Phone number should be of 10 digits!'),
    check('name').notEmpty().withMessage('Name is required'),
    body('name').isLength({min:3}).withMessage('Name should be alteast 3 characters long'),
    body('services.plateNumber').isLength({min:3}).withMessage('Plate number should be alteast 3 characters long'),
    body('services.service').isIn(['Basic','Advanced','Mortuary','Air']).withMessage('Invalid service type'),
],
driverAuthController.signup);
router.post("/login", [
    check('phoneNumber')
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(/^\+91[0-9]{10}$/)
        .withMessage('Phone number should be of 10 digits!'),
],
driverAuthController.login);
router.use(driverAuthController.protect);
router.post("/verify", driverAuthController.verifyOTP);
router.get('/profile',driverAuthController.getProfile);
router.put('/status',driverAuthController.updateDriverStatus);
// router.post('/upload-license', upload.single('license'), driverController.uploadLicense);
// // router.post('/upload-aadhar', upload.single('aadharCard'), driverController.uploadAadhaarCard);
// // router.post('/upload-registration', upload.single('registrationCertificate'), driverController.uploadRegistrationCertificate);

module.exports = router;