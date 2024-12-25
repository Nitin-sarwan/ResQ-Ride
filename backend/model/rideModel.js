const mongoose=require('mongoose');

const rideSchema=new mongoose.Schema({
    user:{
        type:String,
        ref:'User',
        required:true
    },
    driver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
    },
    pickupLocation: {
        type:String,
        required:true
    },
    destination:{
        type:String,
    },
    distance:{
        type:Number
    },
    fare: {
        type: Number,
    },
    status:{
        type:String,
        enum:['pending','accepted','cancelled','completed','expired','in-progress'],
        default:'pending'
    },
    otp:{
        type:String,
        required:true,
        select:false
    },
    feedback:String,
    requestedAt: {
    type: Date,
    default: Date.now,
   },
    acceptedAt:{
    type: Date, 
   },
    completedAt: {
    type: Date, 
   },
   paymentId:{
    type:String
   },
   orderId:{
    type:String
   },
   signature:{
    type:String
   }
});

module.exports=mongoose.model('Ride',rideSchema);