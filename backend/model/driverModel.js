const mongoose=require('mongoose');


const driverSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        validate: {
            validator: function (v) {
                return /^\+91[0-9]{10}$/.test(v);
            },
            message: "{VALUE} is not a valid phone number!",
        },
    },
    otp: {
        type: String,
        required: false
    },
    otpExpire: {
        type: Date,
        required: false
    },
    role:{
        type:String,
        enum:['user','driver'],
        default:'driver'
    },
    location:{
        ltd:{
            type:Number
        },
        lng:{
            type:Number
        }
    },
    status:{
        type:String,
        enum:['Available','riding','offline'],
        default:'Available'
    },
    rideHistory:[
        {
            rideId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Ride',
            },
            pickupLocation: String,
            dropoffLocation: String,
            fare: Number,
            date: Date,
            rating: Number,
            feedback: String,
        }
    ],
    // ratings: {
    //     averageRating:{
    //         type: Number,
    //         default: 0,
    //     },
    //     totalRatings:{
    //         type: Number,
    //         default: 0,
    //     },
    // },
    license: {
        filename: String,
        bucketName: String, // Should match the GridFS bucket name
        uploadedAt: { type: Date },
        status: { 
            type: String,
             enum: ['in_review', 'verified']
             }
    },
    aadharCard: {
        filename: String,
        bucketName: String,
        uploadedAt: { type: Date},
        status: { type: String, enum: ['in_review', 'verified']}
    },
    registrationCertificate: {
        filename: String,
        bucketName: String,
        uploadedAt: { type: Date },
        status: { type: String, enum: ['in_review', 'verified']}
    },
    services:{
        plateNumber:{
            type:String,
        },
        service:{  
            type:String,
            enum:['Basic','Advanced','Mortuary']
        }
    },
    isSignupComplete: {
        type: Boolean,
        default: true,
    },
    socketId: {
        type: String
    }
    
});

// driverSchema.index({ location: '2dsphere' });

// driverSchema.pre('save',function(next){
//     const requiredDocsUploaded = this.license && this.license.filename
//         && this.aadharCard && this.aadharCard.filename;

//     // If all documents are uploaded, mark signup as complete
//     if (requiredDocsUploaded) {
//         this.isSignupComplete = true;
//     } else {
//         this.isSignupComplete = false; // Ensure it's false if documents are incomplete
//     }
// });

driverSchema.pre("save", function (next) {
    if (!this.role) {
        this.role = "driver"
    }
    next();
});

driverSchema.pre('save',function(next){
    if(this.isModified('rideHistory')){
        const ratings = this.rideHistory.map(ride => ride.rating).filter(r => r !== undefined);
        this.ratings.totalRatings = ratings.length;
        this.ratings.averageRating = ratings.length ? ratings.reduce((acc, val) => acc + val, 0) / ratings.length : 0;
    }
    next();
});

module.exports=mongoose.model('Driver',driverSchema);
