function game() {
  function createGameboard() {
    function createCell(row, column) {
      let piece = ".";
      const updatePiece = (newSymbol) =>{
        piece = newSymbol
        return { row, column, piece, updatePiece}
      }
      return { row, column, piece, updatePiece};
    }

   
    // Gameboard made from first row going up
    let gameboard = [
      [createCell(0, 0), createCell(1, 0), createCell(2, 0)],
      [createCell(0, 1), createCell(1, 1), createCell(2, 1)],
      [createCell(0, 2), createCell(1, 2), createCell(2, 2)]
    ]

    const printBoard = () => {
      let printedBoard = ""
      for (let index = 2; index >= 0; index--) {
        const row = gameboard[index]
        let string = ""
        row.forEach((cell) => {
          string += cell.piece
        })
        printedBoard += (string + '\n')
      }
      console.log(printedBoard)
    }

    let placePiece = ({row: row, column: column, piece: piece}) =>{
      gameboard[row][column] = gameboard[row][column].updatePiece(piece)
      printBoard()
    }

    // let updateGameboard = (row, column, piece) => {
    //   const cell = gameboard[row][column]
    //   if(cell.piece === "."){
    //     gameboard = placePiece(gameboard)
    //     printBoard()
    //   } else{
    //     alert("Invalid placement")
    //   }
    // }

    let availableSpaces = () => {
      const cells = gameboard.flat()
      return cells.filter((cell) => cell.piece === "")
    }

    return { gameboard, placePiece, availableSpaces };
  }

  function playGame() {
    let gameboard = createGameboard();
    const players = createPlayers();
    const order = createOrder(players);
    const player1 = order.first;
    const player2 = order.second;
    let currentPlayer = player1;
    while (!isWon()) {
      currentPlayer.playTurn(gameboard);
      currentPlayer = player1 ? player2 : player1;
    }
    return "Someone won???"
    // return winMessage(game.winner);
  }

  function createPlayers() {
    return [
      createPlayer("player", "x", false),
      createPlayer("computer", "o", true),
    ];
  }

  function isWon() {
    // winTypes = [isVerticalWin(), isHorizontalWin(), isDiagonalWin()];
    // return winTypes.some(true);
    return false
  }

  function createPlayer(name, symbol, isComputer) {
    const getUserInput = () =>{
      //todo: change this when ui implemented
      const row = prompt("Select Row")
      const column = prompt("Select Column")
      const piece = symbol
      return {row, column, piece}
    }
    const playTurn = (gameboard) => {
      const randomCell = (array) =>{
        const cell = array[(Math.floor(Math.random() * (array.length - 1)))()]
        const row = cell.row;
        const column = cell.column;
        const piece = symbol
        return {row, column, piece}
      }
      const availableSpaces = gameboard.availableSpaces();
      if (isComputer === "computer") {
        gameboard.placePiece(randomCell(availableSpaces()));
      } else {
        gameboard.placePiece(getUserInput());
      }
    };
    return { name, symbol, isComputer, playTurn };
  }

  function createOrder(players) {
    first = players[(() => Math.floor(Math.random() * 2))()];
    second = players.find((player) => player != first);
    return { first, second };
  }

  playGame();
}
game();
