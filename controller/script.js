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
        groupA.innerHTML += `<button onclick="playSound('groupA', ${i})"> ${json[i]} </button>`
        groupB.innerHTML += `<button onclick="playSound('groupB', ${i})"> ${json[i]} </button>`
        groupC.innerHTML += `<button onclick="playSound('groupC', ${i})"> ${json[i]} </button>`
        groupD.innerHTML += `<button onclick="playSound('groupD', ${i})"> ${json[i]} </button>`
    }

    groupA.innerHTML += `<button class="stop" onclick="stop('groupA')"> STOP - Group A</button>`;
    groupB.innerHTML += `<button class="stop" onclick="stop('groupB')"> STOP - Group B</button>`;
    groupC.innerHTML += `<button class="stop" onclick="stop('groupC')"> STOP - Group C</button>`;
    groupD.innerHTML += `<button class="stop" onclick="stop('groupD')"> STOP - Group D</button>`;
}).catch( err => console.error(`Fetch problem: ${err.message}`) );



const socket = io();
socket.emit("controller");

function playSound(group, fileName){
    socket.emit("play", group, fileName);
}

function stop(group){
    socket.emit("stop", group);
}