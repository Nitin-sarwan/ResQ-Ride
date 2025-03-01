const axios=require('axios');
const driverModel=require('./../model/driverModel')


module.exports.getAddressCoordinates=async(address)=>{
    const api_key = process.env.VITE_GOOGLE_MAPS_API_KEY;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${api_key}`;
    try{
        const response=await axios.get(url);
        //console.log(`Google API Response: ${JSON.stringify(response.data)}`);
        if(response.data.status==='OK'){
            const location=response.data.results[0].geometry.location;
            // console.log(`Extracted Location: ${JSON.stringify(location)}`);
            // console.log(location.lat);
            return{
                ltd:location.lat,
                lng:location.lng
            }
        }
        else{
            throw new Error('unable to fetch the coordinate!');
        }

    }catch(error){
        console.log(error);
        throw error;

    }
};

module.exports.getDistanceTime=async(origin,destination)=>{
    if (!origin || !destination) {
        throw new Error('Origin and Destination are required!');
    }
    const api_key = process.env.VITE_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${api_key}`;
    try {
        const response = await axios.get(url);
      
        if (response.data.status === 'OK') {
            if (response.data.rows[0].elements[0].status === 'ZERO_RESULTS') {
                throw new Error('No routes found');
            }
            return response.data.rows[0].elements[0];
        } else {
            throw new Error('unable to fetch the distance and time');
        }
    } catch (err) {
        // console.error(err);
        throw err;
    }
};

module.exports.getAutoSuggestion=async(input)=>{
    if(!input){
        throw new Error('query is required');
    }
    const api_key = process.env.VITE_GOOGLE_MAPS_API_KEY;
    const country='in';
    const url=`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&components=country:${country}&key=${api_key}`;
    try{
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions;
        }
        else {
            throw new Error('Unable to fetch suggestions');
        }

    }catch(err){
        console.error(err);
        throw err;
    }
};

module.exports.getDriverInTheRadius=async(ltd,lng,radius)=>{

    const drivers=await driverModel.find({
        location:{
            $geoWithin:{
                $centerSphere:[[ltd,lng],radius/6351]
            }
            
        }
    })
    return drivers;
};

module.exports.getAddress=async(ltd,lng)=>{
    if(!ltd || !lng){
        throw new Error('Ltd and Lng are required!');
    }
    const api_key = process.env.VITE_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${ltd},${lng}&key=${api_key}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.results[0].formatted_address;
        } else {
            throw new Error('Unable to fetch the address');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};
module.exports.getNearestHospital=async(ltd,lng)=>{
    if (!ltd || !lng) {
        throw new Error('Ltd and Lng are required!');
    }
    const api_key = process.env.VITE_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${ltd},${lng}&radius=5000&type=hospital&key=${api_key}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK' && response.data.results.length > 0) {
            console.log(response.data.results);
            return response.data.results[0].vicinity;
        } else {
            throw new Error('Unable to fetch the nearest hospital');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};
