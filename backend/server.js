const mongoose=require("mongoose");
const app=require("./app");
const http=require("http");
const {initializeSocket}=require('./socket');

const dotenv=require("dotenv");
dotenv.config({path:"backend/config/config.env"});
mongoose
    .connect(process.env.DATABASE_LOCAL, {
    }).then(() => console.log('DB connection successful!')
);
const server = http.createServer(app);

initializeSocket(server);

server.listen(process.env.PORT,'0.0.0.0',()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`)
});












