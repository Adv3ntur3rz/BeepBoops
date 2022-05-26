let screenNumber = 0;
let font;
const socket = io("https://localhost", { transports: ["websocket"] });
let amp;
let sounds = [];

function preload(){
    font = loadFont("Jost-Medium.ttf");
    let file = [];
    fetch('/filenames').then( response => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
    }).then( (json) => {
        for(let i = 0; i < json.length; i++){
            soundFormats("mp3");
            sounds[i] = loadSound("sounds/" + json[i]);
            console.log(json[i]);
        }
    }).catch( err => console.error(`Fetch problem: ${err.message}`) );
    
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    textFont(font);
    angleMode(DEGREES);
    amp = new p5.Amplitude();
}


socket.on("playSound", (sound)=>{
    if(screenNumber != 0){
        sounds[sound].play();
    }
});

socket.on("stop",()=>{
    if(screenNumber != 0){
        for( let j = 0; j < sounds.length; j++){
            if(sounds[j].isPlaying()){
                sounds[j].stop();
            }
        }
    }
});

function draw() {
    

    if(windowHeight > windowWidth){
        background(255);
        if(screenNumber == 0){
            mainMenu();
        }else{
            mainScreen(screenNumber);
        }
    }else{
        background(255);
        fill(100);
        textSize(height/10);
        textAlign(CENTER,CENTER);
        rectMode(CENTER);
        text("Please rotate your device to portait orientation and lock rotation.", width /2, height /2, width * 0.8, height * 0.8);
    }
}

function windowResized(){
    resizeCanvas(windowWidth,windowHeight);
}


function mainMenu(){
    textAlign(CENTER,BASELINE);
    rectMode(CENTER);
    noStroke();
    fill(200);
    circle(width *0.25, height* 0.4, width *0.25);
    circle(width *0.75, height* 0.4, width *0.25);
    circle(width *0.25, height* 0.6, width *0.25);
    circle(width *0.75, height* 0.6, width *0.25);
    fill(255);
    textSize(height / 20);

    text("A", width *0.25, height* 0.422);
    text("B", width *0.75, height* 0.422);
    text("C", width *0.25, height* 0.622);
    text("D", width *0.75, height* 0.622);
}

function mainScreen(screenNo){
    noStroke();
    fill(100,100,255, map(amp.getLevel(), 0, 0.1, 0, 255));
    rectMode(CORNER);
    rect(0,0,width,height);

    if(screenNo == 1){
        noStroke();
        fill(240);
        textSize(height * 1.3);
        push();
        rotate(130);
        text("A", width / 2, 0);
        pop();
    }
    if(screenNo == 2){
        noStroke();
        fill(240);
        textSize(height * 1.9);
        push();
        rotate(80);
        translate(width *0.8, height *0.5);
        text("B", 0, 0);
        pop();

    }
    if(screenNo == 3){
        noStroke();
        fill(240);
        textSize(height * 1.8);
        push();
        rotate(-70);
        translate(width * - 1.25, height *0.65);
        text("C", 0, 0);
        pop();
    }
    if(screenNo == 4){
        noStroke();
        fill(240);
        textSize(height * 1.13);
        push();
        rotate(10);
        translate(width *0.5, height *0.9);
        text("D", 0, 0);
        pop();
    }

    fill(100);
    stroke(100);
    strokeWeight(height * 0.005);
    strokeCap(ROUND);
    line(width*0.07, height *0.05, width * 0.13, height *0.05);
    line(width*0.07, height *0.05, width * 0.09, height *0.04);
    line(width*0.07, height *0.05, width * 0.09, height *0.06);

    

    
}


function mouseClicked(){
    handleInput(mouseX, mouseY);
    
}

function touchStarted(){
    handleInput(touches[0].x, touches[0].y);
}

function handleInput(x,y){
    if(screenNumber == 0){
        let distToA = dist(x, y, width *0.25, height * 0.4);
        let distToB = dist(x, y, width *0.75, height * 0.4);
        let distToC = dist(x, y, width *0.25, height * 0.6);
        let distToD = dist(x, y, width *0.75, height * 0.6);

        if(distToA < width *0.25){
            screenNumber = 1;
            socket.emit("groupA");
        }

        if(distToB < width *0.25){
            screenNumber = 2;
            socket.emit("groupB");
        }

        if(distToC < width *0.25){
            screenNumber = 3;
            socket.emit("groupC");
        }

        if(distToD < width *0.25){
            screenNumber = 4;
            socket.emit("groupD");
        }
    }else{
        let distToBack = dist(x, y, width *0.1, height * 0.05);

        if(distToBack < width *0.1){

            let roomToLeave;

            if (screenNumber == 1){
                roomToLeave = "groupA";
            }
            if (screenNumber == 2){
                roomToLeave = "groupB";
            }
            if (screenNumber == 3){
                roomToLeave = "groupC";
            }
            if (screenNumber == 4){
                roomToLeave = "groupD";
            }
            screenNumber = 0;


            socket.emit("resetGroup", roomToLeave);
        }
    } 
}