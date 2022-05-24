
// let screenNumber = 0;
// let font;

// function preload(){
//     font = loadFont("Jost-Medium.ttf");
// }

// function setup() {
//     createCanvas(windowWidth, windowHeight);
//     textFont(font);
//     angleMode(DEGREES);
// }
  
// function draw() {
    

//     if(windowHeight > windowWidth){
//         background(0);
        
//     }else{
//         background(255);
//         fill(100);
//         textSize(height/10);
//         textAlign(CENTER,CENTER);
//         rectMode(CENTER);
//         text("Please rotate your device to portait orientation and lock rotation.", width /2, height /2, width * 0.8, height * 0.8);
//     }
// }

// function windowResized(){
//     resizeCanvas(windowWidth,windowHeight);
// }

// function touchStarted(){

//     if(touches){
        
//     }
     
    
// }

const socket = io();
socket.emit("controller");

function playSound(group, fileName){
    socket.emit("play", group, fileName);
}