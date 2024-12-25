const mongoose=require("mongoose");
const validate=require('validator');

const userSchema= new mongoose.Schema({
   name:{
    type:String,
    required:true
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
   otp:{
    type:String,
    required:false
   },
   otpExpire:{
    type:Date,
    required:false
   },
   role:{
      type:String,
      enum:["user","driver"],
      default:"user",
   },
   socketId:{
      type:String
   }
});

userSchema.pre("save",function(next){
   if(!this.role){
      this.role="user"
   }
   next();
});

module.exports=mongoose.model('User',userSchema);