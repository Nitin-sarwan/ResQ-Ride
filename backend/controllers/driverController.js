const express=require("express");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const geolib=require('geolib');
const fs = require('fs');
const path = require('path');
const Driver=require('./../model/driverModel');

exports.confirmOTP = catchAsync(async (req, res, next) => {
    const { rideId, otp } = req.body;

    if (!rideId || !otp) {
        return next(new AppError('Ride ID and OTP are required', 400));
    }

    const ride = await Ride.findById(rideId);
    if (!ride || ride.otp !== otp) {
        return next(new AppError('Invalid OTP or ride not found', 400));
    }

    ride.otp = undefined; // Clear OTP after confirmation
    await ride.save();

    res.status(200).json({
        status: 'success',
        message: 'Ride confirmed.',
        data: { rideId: ride._id },
    });
});

exports.expectedTime=catchAsync(async(req,res,next)=>{
    const { pickupLocation,destination}=req.body;
    if (!pickupLocation ||
        !pickupLocation.coordinates ||
        pickupLocation.coordinates.length !== 2 ||
        !destination ||
        !destination.coordinates ||
        destination.coordinates.length !== 2
    ){
        return next(new AppError('pickup and destination locations are required with valid coordinates',400));
    }

    try {
        // Calculate distance in kilometers
        const distance = geolib.getDistance(
            {
                latitude: pickupLocation.coordinates[1],
                longitude: pickupLocation.coordinates[0],
            },
            {
                latitude: destination.coordinates[1],
                longitude: destination.coordinates[0],
            }
        ) / 1000;

        // Define average speed (in km/h)
        const averageSpeed = 40; // Adjust based on vehicle and traffic conditions

        // Calculate ETA (in hours)
        const timeInHours = distance / averageSpeed;

        // Convert to minutes
        const timeInMinutes = Math.ceil(timeInHours);

        res.status(200).json({
            status: 'success',
            data: {
                distance: `${distance.toFixed(2)} km`,
                eta: `${timeInMinutes} minutes`,
            },
        });
    } catch (error) {
        next(new AppError('Error calculating ETA', 500));
    }  
});


const deleteFile = (filePath) => {
    if (filePath) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                console.log('File deleted successfully');
            }
        });
    } else {
        console.log('No file to delete');
    }
};

// Upload License
exports.uploadLicense = async (req, res, next) => {
    const driverId = req.driver._id;

    if (!req.file) {
        return next(new AppError('No file uploaded', 400));
    }

    const driver = await Driver.findById(driverId);

    if (!driver) {
        deleteFile(req.file.path); // Delete the file if the driver is not found
        return next(new AppError('Driver not found', 404));
    }

    // Check if the license is already uploaded
    if (driver.license && driver.license.filename) {
        // Provide a message based on the current status of the uploaded license
        let message;
        switch (driver.license.status) {
            case 'in_review':
                message = 'License is already uploaded and is under review.';
                break;
            case 'verified':
                message = 'License is already uploaded and verified.';
                break;
            case 'rejected':
                message = 'License is already uploaded but was rejected. Please re-upload.';
                break;
            default:
                message = 'You have to upload your License.';
        }

        deleteFile(req.file.path); // Delete the new upload if license already exists
        return res.status(400).json({
            status: 'fail',
            message,
            data: { licenseStatus: driver.license.status },
        });
    }

    // Save the license details with status 'in_review'
    driver.license = {
        filename: req.file.filename,
        bucketName: req.file.bucketName,
        uploadedAt: new Date(),
        status: 'in_review', // Default status for new uploads
    };

    await driver.save();

    res.status(200).json({
        status: 'success',
        message: 'License uploaded successfully and is now under review.',
        data: { license: driver.license },
    });
};


// // Upload Aadhar Card
exports.uploadAadhaarCard = async (req, res, next) => {
    const driverId = req.driver._id;

    if (!req.file) {
        return next(new AppError('No file uploaded', 400));
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
        deleteFile(req.file.path); // Delete file if driver not found
        return next(new AppError('Driver not found', 404));
    }
    if (driver.aadharCard && driver.aadharCard.filename) {
        // Provide a message based on the current status of the uploaded license
        let message;
        switch (driver.aadharCard.status) {
            case 'in_review':
                message = 'AadharCard is already uploaded and is under review.';
                break;
            case 'verified':
                message = 'AadharCard is already uploaded and verified.';
                break;
            case 'rejected':
                message = 'AadharCard is already uploaded but was rejected. Please re-upload.';
                break;
            default:
                message = 'You have to upload your Aadhar Card.';
        }

        deleteFile(req.file.path); // Delete the new upload if license already exists
        return res.status(400).json({
            status: 'fail',
            message,
            data: { aadharCardStatus: driver.aadharCard.status },
        });
    }


    driver.aadharCard = {
        filename: req.file.filename,
        bucketName: req.file.bucketName,
        uploadedAt: new Date(),
    };
    await driver.save();

    res.status(200).json({
        status: 'success',
        message: 'Aadhaar card uploaded successfully',
        data: { file: req.file.path },
    });
};
// Upload Registration Certificate
exports.uploadRegistrationCertificate = async (req, res, next) => {
    const  driverId  = req.driver._id;

    if (!req.file) {
        return next(new AppError('No file uploaded', 400));
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
        deleteFile(req.file.path);
        return next(new AppError('Driver not found', 404));
    }
    if (driver.registrationCertificate && driver.registrationCertificate.filename) {
        // Provide a message based on the current status of the uploaded license
        let message;
        switch (driver.registrationCertificate.status) {
            case 'in_review':
                message = 'RegistrationCertificate is already uploaded and is under review.';
                break;
            case 'verified':
                message = 'RegistrationCertificate is already uploaded and verified.';
                break;
            case 'rejected':
                message = 'RegistrationCertificate is already uploaded but was rejected. Please re-upload.';
                break;
            default:
                message = 'You have to upload your RegistrationCertificate .';
        }
        deleteFile(req.file.path); // Delete the new upload if license already exists
        return res.status(400).json({
            status: 'fail',
            message,
            data: { registrationCertificate: driver.registrationCertificate.status },
        });
    };


    // driver.registrationCertificate = req.file.path;
    driver.registrationCertificate = {
        filename: req.file.filename,
        bucketName: req.file.bucketName,
        uploadedAt: new Date(),
    };
    await driver.save();

    res.status(200).json({
        status: 'success',
        message: 'Registration certificate uploaded successfully',
        data: { filePath: req.file.path }
    });
};
// exports.vehicle=catchAsync(async(req,res,next)=>{
//     const driverId=req.driver._id;
//     const driver=await Driver.findById(driverId);
//     if(!driver){
//         return next(new AppError('Driver not found',400));
//     }
//     const {vehicle,plate}=req.body;

// })
