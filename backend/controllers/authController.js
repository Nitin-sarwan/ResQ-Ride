const {promisify}=require('util');
const User=require("./../model/userModel");
const catchAsync=require("./../utils/catchAsync");
const crypto=require("crypto");
const jwt = require('jsonwebtoken');
const {validationResult}= require('express-validator');
// const twilio=require('twilio');
// const dotenv=require('dotenv');
// dotenv.config({path:"backend/config/config.env"});
// const Blacklist=require('./../model/blacklistModel');


// console.log(process.env.TWILIO_ACCOUNT_SID);
// console.log(process.env.TWILIO_AUTH_TOKEN);

// to send the otp make sure your twillio  work perfectly and corrent some code snippet

//const client = new twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);
const generateOTP=()=>{
    return crypto.randomInt(100000,999999).toString();
};

const signToken = id => jwt.sign({ id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
});

exports.signup=catchAsync(async(req,res,next)=>{

        // handle validation errors
        const errors=validationResult(req);
       // console.log(errors.isEmpty());
        if(!errors.isEmpty()){
            return res.status(400).json({
                status:'fail',
                errors:errors.array()    
            })
        }

    const{name,phoneNumber,role}=req.body;

    let otp=generateOTP();
    let otpExpire=Date.now()+10*60*1000;

    let user=await User.findOne({phoneNumber});
    if (user) {
        // // If user exists, update the OTP and expiration
        // user.otp = otp;
        // user.otpExpire = otpExpire;
        // await user.save();
        return res.status(400).json({
            message: 'Phone number is already in use.Please try with another phone number.'
        });
        //return next(new AppError('Phone number is already in use. Please try with another phone number',400));
    }else{
        user = await User.create({
            name,
            phoneNumber,
            otp,
            otpExpire,
            role
        });
    }
    // send otp to user phoneNumber
    // await client.messages.create({
    //     body:`Your SignUp OTP is ${otp}`,
    //     from:process.env.TWILIO_phone_Number,
    //     to:phoneNumber
    // });
    let token=signToken(user._id);
    res.cookie("token",token);

    res.status(200).json({
        status:"success",
        token,
       message:"OTP is sent to phone number. Please verify to complete signup",
       data:{
        user
       }
    })
});

exports.verifyOTP=catchAsync(async(req,res,next)=>{
     const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
     //console.log(token);
     if (!token) {
        return res.status(401).json({
            message: "No token provided",
        });
    }

    // Decode the token to get the user ID and phone number
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
     const userId = decodedToken.id;  // Assuming the token contains the user's ID
    //const phoneNumber = decodedToken.phoneNumber; 
   // console.log(phoneNumber);
    const {otp}=req.body;
    try{
    const user=await User.findById(userId);
    
    const expireTime = new Date(user.otpExpire).getTime();

    if (user.otp !== otp || expireTime < Date.now()) {
        return res.status(400).json({
            message: 'Invalid or expired OTP.'
        });
    }

    // OTP is valid, clear OTP fields
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();
    
    res.status(200).json({
        status: "success",
        message: "OTP verified successfully",
        data: { user }
    });
}catch(error){
        console.error("Error during OTP verification:", error);  // Log the error for debugging
        return res.status(500).json({
            message: "An error occurred while verifying the OTP.",
            error: error.message,  // Send the error message in the response for debugging
        });
}
});

exports.login=catchAsync(async(req,res,next)=>{
    // handle validation errors
    const errors = validationResult(req);
    // console.log(errors.isEmpty());
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'fail',
            errors: errors.array()
        })
    }
     const {phoneNumber}=req.body;
     if(!phoneNumber){
       // return next(new AppError('phone number is required',400));
       return res.status(400).json({
        message:"phone number is required."
       });
     }

     let user=await User.findOne({phoneNumber});
     //console.log(user);
     if(!user){
        //return next(new AppError('user not found',401));
        return res.status(401).json({
            message:"user not found."
        })
     }
     let otp=generateOTP();
     let otpExpire = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    // Update user with new OTP details
    user.otp = otp;
    user.otpExpire = otpExpire;
    await user.save();
    // await client.messages.create({
    //     body: `Your Login OTP is ${otp}`,
    //     from: process.env.TWILIO_PHONE_NUMBER,
    //     to: phoneNumber
    // });

    const token = signToken(user._id);
    res.cookie("token",token);

    return res.status(200).json({
        status: "success",
        message: "OTP sent to your phone number. Please verify to complete login.",
        token,
        data:{user}
    });
});

exports.getProfile=catchAsync(async(req,res,next)=>{
    return res.status(201).json(req.user)
});

// exports.logout=catchAsync(async(req,res,next)=>{
//     res.clearCookies('token');
//     const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
//     await Blacklist.create({token});
//     res.status(200).json({
//         status:"success",
//         message:"Logged out successfully"
//     });

// });

exports.protect = catchAsync(async (req, res, next) => {
    // Get token from header
    let token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message:"You are not logged in! Please log in to access this resource."
        })
    }

    //  const isBlacklisted = await Blacklist.findOne({ token });
    //  if(isBlacklisted){
    //     res.status(401).json({message:"You are logged out. Please log in again."});
    //  }
    // Verify token
    // const decoded =await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    let decoded;
    try {
        decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Your token has expired. Please log in again.' })
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message:"Invalid token. Please log in again."})
        } else {
            return res.status(401).json({ message:"Token verification failed. Please log in again."})
        }
    }
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return res.status(401).json({
            message: "The user belonging to this token no longer exists."
        });
    }
    req.user = currentUser;
    next();
});

exports.restictTo=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                message: "You don't have permission to perform that action"});
        }
        next();
    };
};
