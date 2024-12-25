const express=require('express');
const { validationResult } = require('express-validator');
const mapService=require('./../Services/maps.services');

exports.getCoordinates=async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {address}=req.query;
     
    try{
       const coordinate= await  mapService.getAddressCoordinates(address);
       //console.log({coordinate:coordinate});
       res.status(200).json(coordinate);
  }catch(error){
     res.status(404).json({message:'coordinate not found'});
  }
};

exports.getDistanceTime=async(req,res,next)=>{
    try{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.statsu(400).json({
                errors:errors.array()
            })
        }
        const {origin,destination}=req.query;
        const distanceTime=await mapService.getDistanceTime(origin,destination);
        res.status(200).json(distanceTime);
    }catch(err){
        console.error(err);
        res.status(500).json({
            message:'Internal server error'
        })
    }
  
};

exports.getSuggestions=async(req,res,next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.statsu(400).json({
                errors: errors.array()
            })
        }
        const {input}=req.query;
        const suggestion=await mapService.getAutoSuggestion(input);
        res.status(200).json(suggestion);

    }catch(err){
        console.log(err);
        return res.status(500).json({message:'Internal server error'})
    }

};
exports.getAddress=async(req,res,next)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        const { ltd, lng } = req.query;
        const address = await mapService.getAddress(ltd, lng);
        res.status(200).json({address});
    }catch(err){
    console.log(err);
    return res.status(500).json({message:'Internal server error'});
   }
};

exports.getDriverInTheRadius=async(req,res,next)=>{
    try{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        const {ltd,lng,radius}=req.query;
        const vehicles=await mapService.getDriverInTheRadius(ltd,lng,radius);
        res.status(200).json({vehicles});
    }catch(err){
        res.status(500).json({message:'Internal server error',error:err.message});
    }
};

exports.getAvailableVehicles = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { ltd, lng, radius } = req.query;

    try {
        const vehicles = await mapService.getDriverInTheRadius(ltd, lng, radius);
        const availableServices = vehicles
            .filter(vehicle => vehicle.status === 'Available')
            .map(vehicle => vehicle.services.service);
        console.log(availableServices);
        res.status(200).json({ services: availableServices });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getNearestHospital=async(req,res,next)=>{
    try{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        const {ltd,lng}=req.query;
        const hospital=await mapService.getNearestHospital(ltd,lng);
        res.status(200).json({hospital});
    }catch(err){
        res.status(500).json({message:'Internal server error',error:err.message});
    }
};