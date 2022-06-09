let list = document.getElementById("fileList");

getFilesNames();

function getFilesNames(){

    list.innerHTML = "";
    fetch('/filenames').then( response => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
    }).then( (json)=>{
        for (let i = 0; i < json.length; i++){
            list.innerHTML += `<div class="listItem"> ${json[i]} <button type="button" onclick="del('${json[i]}')"> Delete </button> </div>`
        }
    }).catch( err => console.error(`Fetch problem: ${err.message}`) );
}

function del(filename){
    fetch('/delete', 
    {
        method: "DELETE", 
        body: filename
    }); //fix these fetches
    getFilesNames();
}

function upload(){
    let data = new FormData(document.getElementById("upload"));
    fetch('/upload', {method: "POST", body: data}); //fix these fetches
    getFilesNames();
}