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
const port = process.env.PORT || 4000;

server.listen(port,'0.0.0.0',()=>{
    console.log(`server is working on http://localhost:${port}`);
});












