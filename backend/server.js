const dotenv=require("dotenv");
dotenv.config({path:"./config/config.env"});
const mongoose=require("mongoose");
const app=require("./app");
const http=require("http");
const {initializeSocket}=require('./socket');
const connectDatabase=require('./config/database');
connectDatabase();

const server = http.createServer(app);

initializeSocket(server);

app.get("/", (req, res) => {
    res.send("API Working")
});

server.listen(process.env.PORT,'0.0.0.0',()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`)
});












