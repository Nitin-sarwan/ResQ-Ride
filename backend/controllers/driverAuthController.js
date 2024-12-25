const express=require('express');
const {promisify}=require('util');
const Driver=require('./../model/driverModel');
const jwt=require('jsonwebtoken');
const catchAsync=require('./../utils/catchAsync');
const crypto=require('crypto');
const { validationResult } = require('express-validator');


const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
}

const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
});

exports.signup=catchAsync(async(req,res,next)=>{

    // handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'fail',
            errors: errors.array()
        })
    }

    const {name,phoneNumber,services,role}=req.body;
    console.log(req.body);
    if(!name || !phoneNumber || !services.plateNumber || !services.service){
        throw new Error("All fields are required");
      }

    let otp = generateOTP();
    let otpExpire = Date.now() + 10 * 60 * 1000;

    let driver = await Driver.findOne({ phoneNumber });
    if (driver) {
        return res.status(400).json({
            message:"Phone number is already in use. Please try with another phone number"
        })
    } else {
        driver = await Driver.create({
            name,
            phoneNumber,
            otp,
            otpExpire,
            role,
            services
        });
    }
    // send otp to user phoneNumber
    // await client.messages.create({
    //     body:`Your SignUp OTP is ${otp}`,
    //     from:process.env.TWILIO_phone_Number,
    //     to:phoneNumber
    // });
    let token = signToken(driver._id);
    res.cookie("token",token);

    res.status(200).json({
        status: "success",
        token,
        message: "OTP is sent to phone number. Please verify to complete signup",
        data: {
            driver
        }
    })
});

exports.verifyOTP = catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    //console.log(token);
    if (!token) {
        return res.status(401).json({
            message: "No token provided",
        });
    }

    // Decode the token to get the user ID and phone number
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const driverId = decodedToken.id; 
    const { otp } = req.body;
    try {
        const driver = await Driver.findById(driverId);
        const expireTime = new Date(driver.otpExpire).getTime();

        if (driver.otp !== otp || expireTime < Date.now()) {
            return res.status(400).json({
                message: 'Invalid or expired OTP.'
            });
        }

        // OTP is valid, clear OTP fields
        driver.otp = undefined;
        driver.otpExpire = undefined;
        await driver.save();

        res.status(200).json({
            status: "success",
            message: "OTP verified successfully",
            data: { driver }
        });
    } catch (error) {
        console.error("Error during OTP verification:", error);  // Log the error for debugging
        return res.status(500).json({
            message: "An error occurred while verifying the OTP.",
            error: error.message,  // Send the error message in the response for debugging
        });
    }
});

exports.login = catchAsync(async (req, res, next) => {
    const { phoneNumber } = req.body;
    //console.log(phoneNumber);
    if (!phoneNumber) {
        return res.status(400).json({
            message:"phone number is required"
        });
        //return next(new AppError('phone number is required', 400));
    }

    let driver = await Driver.findOne({ phoneNumber });
    //console.log(driver);
    if (!driver) {
        //return next(new AppError('Driver not found', 401));
        return res.status(401).json({
            message:"Driver not found"
        });
    }
    let otp = generateOTP();
    let otpExpire = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    // Update user with new OTP details
    driver.otp = otp;
    driver.otpExpire = otpExpire;
    await driver.save();
    // await client.messages.create({
    //     body: `Your Login OTP is ${otp}`,
    //     from: process.env.TWILIO_PHONE_NUMBER,
    //     to: phoneNumber
    // });

    const token = signToken(driver._id);
    res.cookie('token',token);

    res.status(200).json({
        status: "success",
        message: "OTP sent to your phone number. Please verify to complete login.",
        token,
        data: { driver }
    });
});

exports.getProfile=catchAsync(async(req,res,next)=>{
    return res.status(201).json(req.driver);
});

exports.protect = catchAsync(async (req, res, next) => {
    // Get token from header
    let token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            message: "You are not logged in! Please log in to access this resource."
        })
    }
    let decoded;
    try {
        decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Your token has expired. Please log in again.' })
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token. Please log in again." })
        } else {
            return res.status(401).json({ message: "Token verification failed. Please log in again." })
        }
    }

    // Check if user still exists
    const currentDriver = await Driver.findById(decoded.id);
    if (!currentDriver) {
        return res.status(401).json({
            message:"The driver belonging to this token no longer exists."
        })
        
    }
    req.driver = currentDriver;
    next();
});

exports.updateDriverStatus = catchAsync(async (req, res, next) => {
    // console.log('Driver ID:', req.driver?._id);
    const { isAvailable } = req.body;
    // console.log(req.body)

    const updatedDriver = await Driver.findByIdAndUpdate(
        req.driver._id,
        { isAvailable },
        { new: true, runValidators: true }
    );
   
    // console.log('before Driver:', updatedDriver); 

    if (!updatedDriver) {
        return res.status(404).json({
            status: 'fail',
            message: 'Driver not found'
        });
    }

    if (isAvailable === true) {
        updatedDriver.status = "Available";
    }
    else {
        updatedDriver.status = "offline";
    }
    await updatedDriver.save();
    // console.log('after Driver:', updatedDriver);
    res.status(200).json({
        status: 'success',
        data: {
            driver: updatedDriver
        }
    });
});

exports.restictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.driver.role)) {
            return res.status(403).json({
                message:"You don't have permission to perform that action"
            })
            //return next(new AppError("You don't have permission to perform that action", 403));
        }
        next();
    };
}
exports.checkSignupCompletion = (req, res, next) => {
    if (!req.driver.isSignupComplete) {
        return res.status(403).json({
            message:"Your signup process is not complete. Please complete your signup to access this resource."
        });
        //return next(new AppError('Your signup process is not complete. Please complete your signup to access this resource.', 403));
    }
    next();
};
