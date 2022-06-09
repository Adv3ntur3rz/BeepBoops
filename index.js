const http = require('http');
const express = require('express');
const {Server} = require('socket.io');
const cors = require('cors');
const fs = require("fs");
const multer = require("multer");

const app = express();
const server = http.createServer(app).listen(8080);

let controller;
let stor = multer.diskStorage({destination: (req,file,cb)=>{
    cb(null, "client/sounds/");

},
filename: (req,file,cb)=>{
    const {originalname} = file;
    console.log(originalname);
    cb(null, originalname);
}});
let upload = multer({storage: stor});
// console.log(fileNames);

// const io = new Server(server, {transports: ['websocket']});
const io = new Server(server);
app.use( "/controller", express.static(__dirname +"/controller/"));
app.use("/", express.static(__dirname +"/client/"));

app.get("/", (req,res)=>{
    res.sendFile(__dirname +"/client/index.html");
});

app.get("/filenames/", (req, res)=>{
    let fileNames = fs.readdirSync('client/sounds/');
    res.send(fileNames);
});

app.get("/controller", (req,res)=>{
    res.sendFile(__dirname +"/controller/index.html");
});

app.get("/client", (req, res)=>{
    res.sendFile(__dirname +"/client/index.html");
});

app.post("/upload", upload.single('upload'),(req,res)=>{
    res.write('<p> file uploaded successfully, <a href="../controller"> click here</a> to return to the controller </p>');
    res.end();  
});

io.on("connection", (socket)=>{

    socket.on("controller", ()=>{
        if(!controller){
            controller = socket;
            console.log("controller connected");
        }
        
        controller.on("disconnect", ()=>{
            controller = undefined;
            console.log("controller disconnected");
        });
    });

    socket.on("client", ()=>{
        console.log("client connected");
    });

    socket.on("groupA", ()=>{
        socket.join("groupA");
    });

    socket.on("groupB", ()=>{
        socket.join("groupB");
    });

    socket.on("groupC", ()=>{
        socket.join("groupC");
    });

    socket.on("groupD", ()=>{
        socket.join("groupD");
    });

    socket.on("resetGroup", (room)=>{
        socket.leave(room);
    });

    socket.on("play", (groupName, fileNo)=>{
        io.to(groupName).emit("playSound", fileNo);
    });

    socket.on("loop", (groupName, fileNo, loopStatus)=>{
        io.to(groupName).emit("loopSound", fileNo, loopStatus);
    });

    socket.on("stop", (group,fileNo)=>{
        if(group == "all"){
            io.emit("stopAll");
        }else{
            io.to(group).emit("stop",fileNo);
        }
    });
});

console.log("listening on 8080...");