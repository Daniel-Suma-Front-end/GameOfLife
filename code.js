let totalRows = 50;
let totalColums = 50;

let playing = false;


let timer;
let reproductionTime = 100;

let gridArray =  new Array(totalRows);
let nextGridArray = new Array(totalRows);


function initializeGrids(){
    for( let i = 0; i< totalRows; i++){
        gridArray[i] = new Array(totalColums);
        nextGridArray[i] = new Array(totalColums);
    }
}

function resetGrids(){
    for (let i = 0; i<totalRows; i++){
        for (let j = 0; j<totalColums; j++){
            gridArray[i][j] = 0;
            nextGridArray[i][j] = 0;
        }
    }
}

function copyAndResetGrid() {
    for (let i = 0; i < totalRows; i++) {
        for (let j = 0; j < totalColums; j++) {
            gridArray[i][j] = nextGridArray[i][j];
            nextGridArray[i][j] = 0;
        }
    }
}

function initialize(){
    createGrid();
    initializeGrids();
    resetGrids();
    setupControlButtons();
}

function createGrid(){
    let gridContainer = document.getElementById("gridContainer")
    if(!gridContainer){
        console.error("There is no grid container//Create a (<div>) for the grid")
    }
    let baseGrid = document.createElement("table")

    for (let currentRow = 0; currentRow< totalRows; currentRow++){
        let verticalLine = document.createElement("tr")
        for (let currentColumn = 0; currentColumn < totalColums; currentColumn++ ){
            let cell = document.createElement("td")
            cell.setAttribute("id",currentRow + "_" + currentColumn)
            cell.setAttribute("class","dead")
            cell.onclick = cellClickHandler;
            verticalLine.appendChild(cell);

        }
        baseGrid.appendChild(verticalLine)
    }
    gridContainer.appendChild(baseGrid);
}

function cellClickHandler(){
    let rowCol = this.id.split("_");
    var row = rowCol[0];
    var col = rowCol[1];

    let classes = this.getAttribute("class")

    if (classes.indexOf("live") > -1){
        this.setAttribute("class", "dead")
        gridArray[row][col] = 0
    } else {
        this.setAttribute("class", "live");
        gridArray[row][col] = 1
    }
}

function updateView() {
    for (let i = 0; i < totalRows; i++) {
        for (let j = 0; j < totalColums; j++) {
            var cell = document.getElementById(i + "_" + j);
            if (gridArray[i][j] == 0) {
                cell.setAttribute("class", "dead");
            } else {
                cell.setAttribute("class", "live");
            }
        }
    }
}

function setupControlButtons(){

    let startButton = document.getElementById("start");
    startButton.onclick = startButtonHandler;

    let clearButton = document.getElementById("clear");
    clearButton.onclick = clearButtonHandler;

    let randomButton = document.getElementById("random");
    randomButton.onclick = randomButtonHandler;
}

function randomButtonHandler() {
    if (playing) return;
    clearButtonHandler();
    for (var i = 0; i < totalRows; i++) {
        for (var j = 0; j < totalColums; j++) {
            let isLive = Math.round(Math.random());
            if (isLive == 1) {
                let cell = document.getElementById(i + "_" + j);
                cell.setAttribute("class", "live");
                gridArray[i][j] = 1;
            }
        }
    }
}

function clearButtonHandler(){
    console.log("Clear the game: stop playing, clear the grid");
    playing = false;
    let startButton = document.getElementById("start");
    startButton.innerHTML = "start";

    clearTimeout(timer);

    let cellsList = document.getElementsByClassName("live");
    let cells = [];
    for (var i = 0; i < cellsList.length; i++){
        cells.push(cellsList[i]);
    }
    for (var i = 0; i<cells.length; i++){
        cells[i].setAttribute("class","dead");  
    }
    resetGrids();
}

function startButtonHandler(){
    if(playing){
        console.log("Pause the game");
        playing = false;
        this.innerHTML = "continue";
        clearTimeout(timer);
    } else {
        console.log("Continue the game")
        playing = true;
        this.innerHTML ="pause";
        play();
    }
}

function play(){
    console.log("Play the game");
    computeNextGeneration();
    if (playing) {
        timer = setTimeout(play, reproductionTime);
    }
}

function computeNextGeneration(){
    for(let i = 0; i < totalRows; i++){
        for(let j = 0; j< totalColums; j++){
            applyRules(i,j);
        }
    }
    copyAndResetGrid();
    updateView();
}

function applyRules(row,col){
    let numberNeighbors = countNeighbors(row,col);
    if(gridArray[row][col] == 1){
        if(numberNeighbors<2){
            nextGridArray[row][col] = 0;
        }else if (numberNeighbors == 2 || numberNeighbors == 3){
            nextGridArray[row][col] = 1;
        }else if (numberNeighbors >3){
            nextGridArray[row][col] = 0;
        }
    
    } else if (gridArray[row][col]== 0){
        if(numberNeighbors == 3){
            nextGridArray[row][col] = 1
        }
    }
}
function countNeighbors(row, col) {
    var count = 0;
    if (row-1 >= 0) {
        if (gridArray[row-1][col] == 1) count++;
    }
    if (row-1 >= 0 && col-1 >= 0) {
        if (gridArray[row-1][col-1] == 1) count++;
    }
    if (row-1 >= 0 && col+1 < totalColums) {
        if (gridArray[row-1][col+1] == 1) count++;
    }
    if (col-1 >= 0) {
        if (gridArray[row][col-1] == 1) count++;
    }
    if (col+1 < totalColums) {
        if (gridArray[row][col+1] == 1) count++;
    }
    if (row+1 < totalRows) {
        if (gridArray[row+1][col] == 1) count++;
    }
    if (row+1 < totalRows && col-1 >= 0) {
        if (gridArray[row+1][col-1] == 1) count++;
    }
    if (row+1 < totalRows && col+1 < totalColums) {
        if (gridArray[row+1][col+1] == 1) count++;
    }
    return count;
}

window.onload = initialize();
