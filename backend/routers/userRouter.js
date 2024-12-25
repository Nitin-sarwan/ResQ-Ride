const express=require("express");
const router=express.Router();
const {check}=require('express-validator');
const authController=require("./../controllers/authController");


router.post("/signup", [
    check('phoneNumber')
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(/^\+91[0-9]{10}$/)
        .withMessage('Phone number should be of 10 digits!'),
    check('name').notEmpty().withMessage('Name is required'),
],
authController.signup);
router.post("/login",
    [
        check('phoneNumber')
            .notEmpty()
            .withMessage('Phone number is required')
            .matches(/^\+91[0-9]{10}$/)
            .withMessage('Phone number should be of 10 digits!'),
    ],
 authController.login);

router.use(authController.protect);
router.post("/verify", authController.verifyOTP);
router.get('/profile',authController.protect,authController.getProfile);
// router.get('/logout',authController.protect,authController.logout);

module.exports=router;