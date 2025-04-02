function Gameboard(){
    const rows=3;
    const columns=3;
    const board=[];

    for(let i=0; i<rows; i++){
        board[i]=[];
        for(let j=0; j<columns; j++){
            board[i].push(Cell());
        }
    }

    const getBoard=()=>board;
    //dont understand
    const dropToken = (row, column, player)=>{
        board[row][column].addToken(player);
    }

    const resetBoard = ()=>{
        const resetBoardValues = board.map((row)=>row.map((cell)=>cell.resetValue()));
        return resetBoardValues;
    }

    const boardStatus=()=>{
        const boardWithCellValues= board.map((row)=>row.map((cell)=>cell.getValue()));
        return boardWithCellValues;
    }

    const printBoard=()=>{
        console.log(boardStatus());
    };

return{getBoard, dropToken, printBoard, resetBoard, boardStatus,};
}

function Cell(){
    let value=" "

    const addToken = (player)=>{
        value=player;
    }

    const getValue=()=> value;

    const resetValue =()=> value= " ";

    return{
        addToken,
        getValue,
        resetValue,
    };
}

function GameController(playerOneName="Player One", playerTwoName="Player Two"){
    const board = Gameboard();

    const players=[
        {
            name:playerOneName,
            token:"x"
        },
        {
            name:playerTwoName,
            token:"o"
        }
    ];

    const getPlayerOne = ()=> players[0].name;
    const getPlayerTwo = ()=> players[1].name;
    
    const setPlayerOneName = (newName) => {
        players[0].name = newName
    }

    const setPlayerTwoName = (newName) => {
        players[1].name = newName
    }

    let activePlayer = players[0];

    const switchPlayerTurn = ()=>{
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    
    const getActivePlayer = () => activePlayer;
  
    const printNewRound = () => {
      board.printBoard();
      console.log(`${getActivePlayer().name}'s turn.`);
    };

    const resetBoard =()=>{
        board.resetBoard();
        activePlayer = players[0];
        printNewRound();
    } 

    const playRound = (row, column) => {
        // Drop a token for the current player

        console.log(
        `${getActivePlayer().name}'s choice has been placed into  row${row} column${column}...`
        );
        board.dropToken(row, column, getActivePlayer().token);
    
    
        const checkWinCondition = ()=>{
        //so confused about the logic of gameStatus
        const gameStatus = board.boardStatus();
        let XWinner = false;
        let OWinner = false;

        gameStatus.forEach(row => {
            const xSameRow = (sameRow)=>{
            return sameRow.every(value=>value==="x")};

            const oSameRow=(sameRow)=>{
            return sameRow.every(value=>value==="o")};

            if(xSameRow(row)){
                XWinner = true;
            }else if(oSameRow(row)){
                OWinner = true;
            }
        })

        for(let i=0; i<gameStatus.length; i++){
            if(gameStatus[0][i]==="x"){
                if(gameStatus[1][i]==="x"){
                 if(gameStatus[2][i]==="x"){
                    XWinner = true;
                 }
                }
             }
        }

        for(let i=0; i<gameStatus.length; i++){
            if(gameStatus[0][i]==="o"){
                if(gameStatus[1][i]==="o"){
                 if(gameStatus[2][i]==="o"){
                    OWinner = true;
                 }
                }
             }
        }


        if(gameStatus[1][1]==="x"){
            if(gameStatus[0][0]==="x"){
                if(gameStatus[2][2]==="x"){
                    XWinner = true;
                }
            }

            if(gameStatus[0][2]==="x"){
                if (gameStatus[2][0]==="x"){
                    XWinner = true;
                }
            }
        }

        if(gameStatus[1][1]==="o"){
            if(gameStatus[0][0]==="o"){
                if(gameStatus[2][2]==="o"){
                    OWinner = true;
                }
            }

            if(gameStatus[0][2]==="o"){
                if (gameStatus[2][0]==="o"){
                    OWinner = true;
                }
            }
        }

        if((OWinner === true )||(XWinner === true) ){
            return `${getActivePlayer().name}'s win! Amazing`;
        }

        const checkTie=gameStatus.every((row)=>
            row.every(cell=>(cell==="x"||cell==="o"))//need to add that has has been no prior win
        )
        if ((OWinner === false )&&(XWinner === false)&&(checkTie===true)){
            return "It's a tie :)";
        }

        }

        let winResult = checkWinCondition();

        if(winResult){
            return winResult;
        }

        switchPlayerTurn();
        printNewRound();
    }

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard, //confuse about this. why need to add this stuff. 
        //why cant just acess direct from Gameboard()
        boardStatus: board.boardStatus,
        getPlayerOne,
        getPlayerTwo,
        setPlayerOneName,
        setPlayerTwoName,
        resetBoard,
      };
}
    
function ScreenController(){

    const game= GameController();
    let playerOneName = game.getPlayerOne();
    let playerTwoName = game.getPlayerTwo();
    let activePlayer = game.getActivePlayer();

    const playerOneDiv=document.querySelector(".editablePlayerOne");
    const playerTurnDiv=document.querySelector(".turn");
    const playerTwoDiv=document.querySelector(".editablePlayerTwo");
    const boardDiv = document.querySelector('.board');
    
    const updateScreen = ()=>{
    boardDiv.textContent = " ";
    //why need to reassign again?
    const board = game.getBoard();
    playerOneName = game.getPlayerOne();
    playerTwoName = game.getPlayerTwo();
    activePlayer = game.getActivePlayer();

    const editButtonOne = document.createElement("button");
    const buttonTextOne = document.createTextNode("Change Name");
    const editButtonTwo = document.createElement("button");
    const buttonTextTwo = document.createTextNode("Change Name");
    
    playerOneDiv.textContent=`${playerOneName}`
    playerTwoDiv.textContent=`${playerTwoName}`

    editButtonOne.appendChild(buttonTextOne);
    editButtonTwo.appendChild(buttonTextTwo);
    playerOneDiv.appendChild(editButtonOne);
    playerTwoDiv.appendChild(editButtonTwo);
    
   function changePlayerOneName() {
    let updatedNameOne = prompt("Please write Player One's name");
    
    if (updatedNameOne) {
        game.setPlayerOneName(updatedNameOne);
        updateScreen();
    }
}

function changePlayerTwoName() {
    let updatedNameTwo = prompt("Please write Player Two's name");
    
    if (updatedNameTwo) {
        game.setPlayerTwoName(updatedNameTwo);
        updateScreen();
    }
}
    
    editButtonOne.addEventListener("click",changePlayerOneName)
    editButtonTwo.addEventListener("click",changePlayerTwoName)
    
        board.forEach((row, index)=>{
        let rowValue= index
        row.forEach((cell,index)=>{
            const cellButton = document.createElement("button");
            cellButton.classList.add("cell");
            cellButton.dataset.column = index
            cellButton.dataset.row = rowValue
            cellButton.textContent = cell.getValue();
            boardDiv.appendChild(cellButton);
        })
    })
}

function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;
    const getGameStatus = game.boardStatus()
    // Make sure I've clicked a column and not the gaps in between
    if (!selectedColumn) return;
    //
    if((getGameStatus[selectedRow][selectedColumn]==="x")||
       (getGameStatus[selectedRow][selectedColumn]==="o")){
        return;
       }

    const gameResults = game.playRound(selectedRow, selectedColumn);
    updateScreen();

    if(gameResults){
        playerTurnDiv.textContent = gameResults;
        boardDiv.removeEventListener("click", clickHandlerBoard);
    }else{
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
    }
  }


  function startResetButton(){
    
    let start = true;
    const startButtonGame = document.querySelector(".startGameButton");
//continue
    startButtonGame.addEventListener("click", ()=>{
      if(start){
        startGame();
      }else{
        resetGame();
      }
      start =!start
    });
  
    function startGame(){
      playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
      startButtonGame.textContent = "Reset Game";
      boardDiv.addEventListener("click", clickHandlerBoard);
    }
  
    function resetGame(){
      startButtonGame.textContent = "Start Game";
      boardDiv.removeEventListener("click", clickHandlerBoard);
      game.resetBoard();
      game.setPlayerOneName("Player One");
      game.setPlayerTwoName("Player Two");
      playerTurnDiv.textContent = "Press Start to begin...";
      updateScreen();
    }
  }

  
  updateScreen();
  startResetButton();

}

ScreenController();