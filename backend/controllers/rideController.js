const Ride = require('./../model/rideModel');
const Driver = require('./../model/driverModel');
const catchAsync = require('./../utils/catchAsync');
const crypto=require('crypto');
const mapService=require('./../Services/maps.services');
const rideService=require('./../Services/ride.services');
const {validationResult}=require('express-validator');
const { sendMessageToSocketId } = require('../socket');
const rideModel=require('./../model/rideModel');


exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { pickupLocation, destination } = req.query;
    try {
        const fare = await rideService.getFare(pickupLocation, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
exports.requestRide =async (req, res) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {pickupLocation,destination,service}=req.body;
    try{
        const ride=await rideService.createRide({user:req.user._id,pickupLocation,destination,service});
         res.status(200).json(ride);

         const pickupCoordinate=await mapService.getAddressCoordinates(pickupLocation);
        
         const driversInRadius=await mapService.getDriverInTheRadius(pickupCoordinate.ltd,pickupCoordinate.lng,30000);
       
         ride.otp='';

         const filteredDrivers = driversInRadius.filter(driver => driver.services.service === service && driver.status === 'Available');
         console.log('filtered drivers:',filteredDrivers);
        //  if(filteredDrivers.length===0){
        //     throw new Error('No driver found in the radius');
        //  }
         //console.log('now otp is :', ride.otp);
        //  console.log(driversInRadius);
        const rideWithUser=await rideModel.findOne({_id:ride._id}).populate('user');
        // console.log(rideWithUser);
        //for all driver in that radius
         filteredDrivers.map(driver=>{
            //console.log(driver,ride);
            sendMessageToSocketId(driver.socketId,{
                event:'new-ride',
                data:rideWithUser
               }
            )
         });

        // for all driver of specific serivce
        // filteredDrivers.map(driver=>{
        //     sendMessageToSocketId(driver.socketId,{
        //         event:'new-ride',
        //         data:rideWithUser
        //        }
        //     )
        // }); 

    }catch(err){
        console.log(err);
        return res.status(500).json({message:err.message});
    } 
};
exports.confirmRide=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {rideId}=req.body;
    try{
        const ride=await rideService.confirmRide({rideId,driver:req.driver});
          
        //send a message to all other drivers except the driver who accepted the ride
        const pickupCoordinate = await mapService.getAddressCoordinates(ride.pickupLocation);
        const driversInRadius = await mapService.getDriverInTheRadius(pickupCoordinate.ltd, pickupCoordinate.lng, 30000);
        const filteredDrivers = driversInRadius.filter(driver => driver._id.toString() !== req.driver._id.toString());

        filteredDrivers.forEach(driver => {
            sendMessageToSocketId(driver.socketId, {
                event: 'ride-already-accepted',
                data: { rideId }
            });
        });

        sendMessageToSocketId(ride.user.socketId,{
            event:'ride-confirmed',
            data:ride
        })
        return res.status(200).json(ride);

    }catch(err){
         return res.status(500).json({message:err.message});
    }

};
exports.startRide=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {rideId,otp}=req.query;
    try{
        const ride=await rideService.startRide({rideId,otp,driver:req.driver});
        sendMessageToSocketId(ride.user.socketId,{
            event:'ride-started',
            data:ride
        });
        return res.status(200).json(ride);
    }catch(err){
        console.log(err);
        return res.status(500).json({message:err.message});
    }
};
exports.endRide=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.message});
    }
    const {rideId}=req.body;
    try{
        const ride=await rideService.endRide({rideId,driver:req.driver});
        sendMessageToSocketId(ride.user.socketId,{
            event:'ride-ended',
            data:ride
        });
        return res.status(200).json(ride);
    }catch(err){
        return res.status(500).json({message:err.message});
    }

};

exports.requestEmergencyRide=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {pickupLocation,service}=req.body;
    try{
        const ride=await rideService.createEmergencyRide({user:req.user._id,pickupLocation,service});
        res.status(200).json(ride);
        ride.otp='';
        const pickupCoordinate=await mapService.getAddressCoordinates(pickupLocation);
        const driversInRadius=await mapService.getDriverInTheRadius(pickupCoordinate.ltd,pickupCoordinate.lng,30000);
        const filteredDrivers=driversInRadius.filter(driver=>driver.services.service===service && driver.status==='Available');
       // console.log('filtered drivers:',filteredDrivers);
        const rideWithUser=await rideModel.findOne({_id:ride._id}).populate('user');
        filteredDrivers.map(driver=>{
            sendMessageToSocketId(driver.socketId,{
                event:'new-emergency-ride',
                data:rideWithUser
            });
        });    
    }catch(err){
        console.log(err);
        return res.status(500).json({message:err.message});
    }
};

exports.confirmEmergencyRide=async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { rideId } = req.body;
    try {
        const ride = await rideService.confirmEmergencyRide({ rideId, driver: req.driver });

        // Send a message to all other drivers except the driver who accepted the ride
        const pickupCoordinate = await mapService.getAddressCoordinates(ride.pickupLocation);
        const driversInRadius = await mapService.getDriverInTheRadius(pickupCoordinate.ltd, pickupCoordinate.lng, 30000);
        const filteredDrivers = driversInRadius.filter(driver => driver._id.toString() !== req.driver._id.toString());

        filteredDrivers.forEach(driver => {
            sendMessageToSocketId(driver.socketId, {
                event: 'emergency-ride-already-accepted',
                data: { rideId }
            });
        });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'emergency-ride-confirmed',
            data: ride
        });
        return res.status(200).json(ride);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


