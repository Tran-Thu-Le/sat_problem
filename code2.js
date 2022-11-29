// -------------------------------------
// utils functions
// -------------------------------------
function toID(i, j){
    return i.toString()+j.toString()
}
//px
function toPx(size){
    return size.toString()+"px"
}


// -------------------------------------
// create elements and render out
// -------------------------------------
function createCellContainer(m ,n){
    const box = document.getElementById('cellContainer');
    box.setAttribute('nrows', m);
    box.setAttribute('ncols', n); 

    arr = createRandomArray(m, n)

    for(let i = 0; i<=m; i++){
        for(let j = 0; j<=n; j++){
            // console.log(i, j, arr[i][j])
            cellOper = arr[i][j];
            el = createButtons(i, j, m, n, cellOper);
            box.appendChild(el);
        }
    };


    // style 
    box.style.gridTemplateColumns = (toPx(cellWidth)+" ").repeat(n+1);
    box.style.width = (cellWidth*(n+1)).toString()+"px";
}

function createRandomArray(m, n){
    var arr = [];
    for (i=0; i<=m; i++){
        var row = [];
        for (j=0; j<=n; j++){
            k = difficulty;
            value = Math.floor(Math.random() * (2*k+1))-k;
            if (value==k){
                value=1
            }
            else if (value==-k){
                value=-1
            }
            else{
                value=0
            }
            row.push(value)
        };
        arr.push(row)
    };
    return arr // -1, 0, 1
}

function createButtons(i, j, m, n, cellOper){
    const el = document.createElement('button');

    el.id = toID(i, j);

    el.classList.add('cell');

    if (i>=1 && i<=m && j>=1 && j<=n){
        el.setAttribute('oper', cellOper);// -1, 0, 1

        el.classList.add('oper')

        if (cellOper==-1){
            el.classList.add('minus')
        }
        else if (cellOper==0){
            el.classList.add('unsign')
        }
        else {
            el.classList.add('plus')
        }

    }
    else if (i==0 && j!=0){
        el.classList.add('input');
    }
    else if (i!=0 && j==0){
        el.classList.add('output');
    }
    else {
        el.classList.add('result')
    }

    el.setAttribute('row', i);
    el.setAttribute('col', j);
    el.setAttribute('value', 0);//init value

    // style 
    el.style.width=toPx(cellWidth);
    el.style.height=toPx(cellWidth);
 
    return el;
}


// -------------------------------------
// game logic
// -------------------------------------
function startGame(){
    inputs = document.querySelectorAll(".input");

    //init status of game
    inputs.forEach(ip => {ip.setAttribute("value", 1); ip.textContent=1});
    for (j=1; j<=n; j++){
        evalOperCol(j);
    };
    evalOR();
    evalAND();
    
    // run game
    inputs.forEach(cell => cell.addEventListener("click", cellClicked));

    restartButton = document.querySelector("#restartGameButton");
    restartButton.addEventListener("click", restart);
}
function evalOperCol(j){
    // render col 
    for (i=1; i<=m; i++){   
        oper = document.getElementById(toID(i, j));
        input = document.getElementById(toID(0, j));
        if (!oper.classList.contains("unsign")) {
            oo = oper.getAttribute("oper");
            iv = input.getAttribute("value");
            ov= 0; // oper value
            if (oo==1 && iv==1){
                ov = 1
            }
            else if (oo==1 && iv==0){
                ov=0
            }
            else if (oo==-1 && iv==1){
                ov=0
            }
            else if (oo==-1 && iv==0){
                ov=1
            }
            oper.setAttribute("value", ov)
            oper.textContent = ov
        }
    }
}
function evalOR(){
    for (i=1; i<=m; i++){
        outputValue = 0;
        for (j=1; j<=n; j++){
            cell = document.getElementById(toID(i, j));
            if (cell.getAttribute("value")==1){
                outputValue=1;
                break;
            }
        }
        // update 
        output = document.getElementById(toID(i, 0));
        output.setAttribute("value", outputValue);
        output.textContent = outputValue;
    }
}
function evalAND(){
    resultValue = 1;
    for (i=1; i<=m; i++){
        cell = document.getElementById(toID(i, 0));
        if (cell.getAttribute("value")==0){
            resultValue=0;
            break;
        }
    }
    // update 
    output = document.getElementById(toID(0, 0));
    output.setAttribute("value", resultValue);
    output.textContent = resultValue;
}
function cellClicked(){
    
    
    // row and col of onclick-cell = input
    // const row = this.getAttribute("row");
    // const col = this.getAttribute("col");

    if (this.classList.contains("input")){
        // toggle input-value and render input-text
        if (this.getAttribute("value")==0){
            this.textContent = 1
            this.setAttribute("value", 1)
        }
        else {
            this.textContent = 0
            this.setAttribute("value", 0)
        }
        // console.log("here onlick cell:", inputValue, this.getAttribute("value"))


        evalOperCol(this.getAttribute("col"));
        evalOR();
        evalAND();

        // render output
    }
}
function restart(){
    inputs = document.querySelectorAll(".input");

    //init status of game
    inputs.forEach(ip => {ip.setAttribute("value", 1); ip.textContent=1});
    for (j=1; j<=n; j++){
        evalOperCol(j);
    };
    evalOR();
    evalAND();
}




// -------------------------------------
// run game
// -------------------------------------
const difficulty = 2;
const cellWidth = 75;
const m = 5;
const n = 7;
createCellContainer(m, n)
startGame()
