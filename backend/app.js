const express=require("express");
const app=express();
const cors=require('cors');
const cookieParser=require('cookie-parser');
const userRouter=require("./routers/userRouter");
const rideRouter=require("./routers/rideRouter");
const driverRouter=require('./routers/driverRouter');
const adminRouter=require('./routers/adminRouter');
const mapRouter=require('./routers/mapRouter');
const morgan=require('morgan');

require('dotenv').config();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(cors());
app.use(cookieParser());



app.use('/api/v1/user',userRouter);
app.use('/api/v1/ride',rideRouter);
app.use('/api/v1/driver',driverRouter);
app.use('/api/v1/admin',adminRouter);
app.use('/api/v1/maps',mapRouter);

module.exports=app;