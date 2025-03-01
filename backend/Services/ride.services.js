const driverModel = require('../model/driverModel');
const rideModel=require('../model/rideModel');
const { sendMessageToSocketId } = require('../socket');
const mapService=require('./maps.services');
const crypto=require('crypto');

async function getFare(pickupLocation,destination){
    if(!pickupLocation || !destination){
        throw new Error("Pickup and destination are required");
    }
    const distanceTime=await mapService.getDistanceTime(pickupLocation,destination);
    // console.log(distanceTime);
     const fareRates={
        "Basic":500,
        "Advanced":2000,
        "Mortuary":300,
        "Air":100000
     }
     const farePerKm={
        "Basic":20,
        "Advanced":50,
        "Mortuary":15,
        "Air":1500
     }
     const fare={
         Basic:Math.round(fareRates.Basic+((distanceTime.distance.value/1000)*farePerKm.Basic),2),
         Advanced: Math.round(fareRates.Advanced + ((distanceTime.distance.value / 1000) * farePerKm.Advanced),2),
         Mortuary: Math.round(fareRates.Mortuary + ((distanceTime.distance.value / 1000) * farePerKm.Mortuary) ,2),
         Air: Math.round(fareRates.Air + ((distanceTime.distance.value / 1000) * farePerKm.Air),2)
     }
     return fare;
}
module.exports.getFare=getFare;

const generateOTP = () => {
    const otp= crypto.randomInt(1000, 10000).toString();
    return otp;
}
module.exports.createRide=async({
    user,pickupLocation,destination,service
})=>{
    if(!user || !pickupLocation || !destination || !service){
        throw new Error('All fields are required');
    }
    const fare=await getFare(pickupLocation,destination);
    // console.log(fare[service]);
    const otp=generateOTP();
    const ride=rideModel.create({
        user,
        pickupLocation,
        destination,
        otp,
        fare:fare[service]
    })
    return ride
};
module.exports.confirmRide=async({rideId,driver})=>{
    if(!rideId){
        throw new Error('ride id is required!')
    }
    await rideModel.findOneAndUpdate({
        _id:rideId
    },{
        status:'accepted',
        driver:driver._id
    });
    const ride=await rideModel.findOne({_id:rideId}).populate('user').populate('driver').select('+otp');
    if(!ride){
        throw new Error('Ride not found');
    }
    return ride;
};
module.exports.startRide=async({rideId,otp,driver})=>{
    
    if(!rideId || !otp){
        throw new Error('Ride id and otp is required!');
    }
    const ride=await rideModel.findOne({
        _id:rideId
    }).populate('user').populate('driver').select('+otp');
    if(!ride){
        throw new Error('Ride not found');
    }
    if(ride.status !== 'accepted'){
        throw new Error('Ride not accepted');
    }
    if(ride.otp !== otp){
        throw new Error('Invalid otp');
    }
    await rideModel.findOneAndUpdate({
        _id:rideId
    },{
        status:'ongoing'
    });
    await driverModel.findOneAndUpdate({
        _id:driver._id
    },{
        status:'riding'
    });
    sendMessageToSocketId(ride.user.socketId,{
        event:'ride-started',
        data:ride
    })
    return ride
};
module.exports.endRide = async ({ rideId, driver }) => {
    if (!rideId) {
        throw new Error('Ride id is required!');
    }
    const ride = await rideModel.findOne({
        _id: rideId,
        driver: driver._id
    }).populate('user').populate('driver').select('+otp');
    if (!ride) {
        throw new Error('Ride not found');
    }
    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }
    await rideModel.findOneAndUpdate({
        _id: rideId,
        driver: driver._id
    }, {
        status: 'completed'
    });
    await driverModel.findOneAndUpdate({
        _id: driver._id
    }, {
        status: 'Available'
    });

    // Update ride history after completing the ride
    await driverModel.findOneAndUpdate({
        _id: driver._id
    }, {
        $push: {
            rideHistory: {
                rideId: ride._id,
                pickupLocation: ride.pickupLocation,
                destination: ride.destination,
                fare: ride.fare,
                userName: ride.user.name,
                userPhoneNumber: ride.user.phoneNumber
            }
        }
    });
    // console.log("ride",ride);

    sendMessageToSocketId(ride.user.socketId, {
        event: 'ride-ended',
        data: ride
    });

    return ride;
};
module.exports.createEmergencyRide=async({user,pickupLocation,service})=>{
    if(!user || !pickupLocation || !service){
        throw new Error('All fields are required');
    }
    const otp=generateOTP();
    const ride=rideModel.create({
        user,
        pickupLocation,
        otp,
    });
    return ride;
};
module.exports.confirmEmergencyRide = async ({ rideId, driver }) => {
    if (!rideId) {
        throw new Error('Ride id is required!');
    }
    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        driver: driver._id
    });
    const ride = await rideModel.findOne({ _id: rideId }).populate('user').populate('driver').select('+otp');
    if (!ride) {
        throw new Error('Ride not found');
    }
    return ride;
};
