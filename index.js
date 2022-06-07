const http = require('http');
const express = require('express');
const {Server} = require('socket.io');
const cors = require('cors');
const fs = require("fs");

const app = express();
const server = http.createServer(app).listen(8080);

let controller;
let fileNames = fs.readdirSync('client/sounds/');

// console.log(fileNames);

// const io = new Server(server, {transports: ['websocket']});
const io = new Server(server);
app.use( "/controller", express.static(__dirname +"/controller/"));
app.use("/client", express.static(__dirname +"/client/"));

app.get("/", (req,res)=>{
    res.sendFile(__dirname +"/client/index.html");
});

app.get("/filenames/", (req, res)=>{
    res.send(fileNames);
});

app.get("/controller", (req,res)=>{
    res.sendFile(__dirname +"/controller/index.html");
});

app.get("/client", (req, res)=>{
    res.sendFile(__dirname +"/client/index.html");
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