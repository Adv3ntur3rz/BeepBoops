let files = [];

let groupA = document.getElementById("groupA");
let groupB = document.getElementById("groupB");
let groupC = document.getElementById("groupC");
let groupD = document.getElementById("groupD");

fetch('/filenames').then( response => {
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
}).then( (json)=>{
    for (let i = 0; i < json.length; i++){
        groupA.innerHTML += 
        `<div class="sampleButtons">
        <button class="play" onclick="playSound('groupA', ${i})"> ${json[i]} </button>  
        <label class="loopButton"></label><input  type="checkbox" onclick="loop('groupA', ${i}, this)" /> 🔁 </label> 
        <button class="stop" onclick="stop('groupA', ${i})">Stop</button>
        </div>`;
        groupB.innerHTML += 
        `<div class="sampleButtons">
        <button class="play"  onclick="playSound('groupB', ${i})"> ${json[i]} </button>
        <label class="loopButton"></label><input  type="checkbox" onclick="loop('groupB', ${i}, this)" /> 🔁 </label> 
        <button class="stop" onclick="stop('groupB', ${i})">Stop</button>
        </div>`;
        groupC.innerHTML += `<div class="sampleButtons"><button class="play"  onclick="playSound('groupC', ${i})"> ${json[i]} </button>
        <label class="loopButton"></label><input  type="checkbox" onclick="loop('groupC', ${i}, this)" /> 🔁 </label> 
        <button class="stop" onclick="stop('groupC', ${i})">Stop</button>
        </div>`;
        groupD.innerHTML += `<div class="sampleButtons">
        <button class="play"  onclick="playSound('groupD', ${i})"> ${json[i]} </button>
        <label class="loopButton"></label><input  type="checkbox" onclick="loop('groupD', ${i}, this)" /> 🔁 </label> 
        <button class="stop" onclick="stop('groupD', ${i})">Stop</button>
        </div>`;
    }
}).catch( err => console.error(`Fetch problem: ${err.message}`) );



const socket = io();
socket.emit("controller");

function playSound(group, fileName){
    socket.emit("play", group, fileName);
}

function stop(group,fileName){
    socket.emit("stop", group, fileName);
}

function loop(group, file, check){
    socket.emit("loop",group, file, check.checked);
}


