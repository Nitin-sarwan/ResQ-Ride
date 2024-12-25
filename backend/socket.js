const socketIo=require('socket.io');
const userModel=require('./model/userModel');
const driverModel = require('./model/driverModel');
let io;

function initializeSocket(server){
    io=socketIo(server,{
        cors:{
            origin:'*',
           methods:['Get','POST']
        }
    });

    io.on('connection',(socket)=>{
        console.log(`Client connected: ${socket.id}`);

        socket.on('join',async(data)=>{
            const {userId,userType}=data;

            console.log(`User ${userId} joined as ${userType}`)

            if(userType=='user'){
                await userModel.findByIdAndUpdate(userId,{socketId:socket.id});
            }
            else if(userType=='driver'){
                await driverModel.findByIdAndUpdate(userId,{socketId:socket.id});
            }

        });

        socket.on('update-location-driver',async(data)=>{
            const {userId,location}=data;
            if(!location || !location.ltd ||!location.lng){
                return socket.emit('error',{message:'Invalid location data'})
            }
            await driverModel.findByIdAndUpdate(userId,{
                location:{
                ltd:location.ltd,
                lng:location.lng
            }});
        })
        socket.on('disconnected',()=>{
            console.log(`Client disconnected ${socket.id}`);
        });
    });
}

function sendMessageToSocketId(socketId,messageObject){
    console.log(`sending message to ${socketId}`,messageObject)
    if(io){
        io.to(socketId).emit(messageObject.event,messageObject.data);
    }
    else{
        console.log('socket.io is not initialize');
    }
}

module.exports={initializeSocket,sendMessageToSocketId};