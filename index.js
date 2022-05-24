const http = require('http');
const express = require('express');
const {Server} = require('socket.io');
const cors = require('cors');
const fs = require("fs");

const app = express();
const server = http.createServer(app).listen(3030);

let controller;

const io = new Server(server, {
    cors:{
        origin:"https://randielzoquier.com/" //handled :)
    }
});

app.use( "/controller", express.static(__dirname +"/controller/"));
app.use("/client", express.static(__dirname +"/client/"));

app.get("/", (req,res)=>{
    res.send("Test");
});

app.get("/controller", (req,res)=>{
    res.sendFile(__dirname +"/controller/index.html");
});

app.get("/client", (req, res)=>{
    res.sendFile(__dirname +"/client/index.html");
});

io.on("connection", (socket)=>{

    socket.on("controller", ()=>{
        controller = socket;
        console.log("controller connected");
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

    socket.on("play", (groupName, fileName)=>{
        io.to(groupName).emit("playSound", fileName);
    })
});


if(controller){
    controller.on("disconnect", ()=>{
        console.log("controller disconnected");
    });
}


console.log("listening on 3030...");