// const User = require("./../model/userModel");
// const catchAsync = require("./../utils/catchAsync");



// exports.sendlocation=catchAsync(async(req,res)=>{
//     const {latitude,longitude}=req.body;
//     const radius=5000/6378.1;
//     const nearByDrivers=await Driver.find({
//         location:{
//             $geowithin:{
//                 $centerSphere:[[latitude,longitude],radius]
//             }
//         },
//         status:"available"
//     });
//     nearByDrivers.forEach((driver) => {
//         const driverSocket = activeDrivers[driver.id]; // Assume activeDrivers map has socket IDs for each driver
//         if (driverSocket) {
//             io.to(driverSocket).emit('ride-request', {
//                 pickupLocation: { latitude, longitude },
//                 destination
//             });
//         }
//     });
//     res.json(nearByDrivers);
// });

