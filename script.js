function game() {
  let squares = document.querySelectorAll('.square')

  function removeResultMessage() {
    const resultMessage = document.querySelector('.result');
    if (resultMessage) {
      resultMessage.remove();
    }
  }

  function removeSquareListeners() {
    squares.forEach((square) => {
      const newSquare = square.cloneNode(true);
      newSquare.textContent = ""
      square.parentNode.replaceChild(newSquare, square);
    });
  }


  

  async function playGame() {
    const gameboard = (function createGameboard() {
      function createCell(column, row) {
        let piece = ".";
        const updatePiece = (newSymbol) => {
          piece = newSymbol;
          return { row, column, piece, updatePiece };
        };
        return { row, column, piece, updatePiece };
      }
  
      // Gameboard made from first row going up
      let gameboard = [
        [createCell(0, 0), createCell(1, 0), createCell(2, 0)],
        [createCell(0, 1), createCell(1, 1), createCell(2, 1)],
        [createCell(0, 2), createCell(1, 2), createCell(2, 2)],
      ];
  
      const printBoard = () => {
        let printedBoard = "";
        for (let index = 2; index >= 0; index--) {
          const row = gameboard[index];
          const rows = document.querySelectorAll('.row')
          const rowSquares = rows[2-index].querySelectorAll('.square')
          let string = "";
          for (let index = 0; index <= 2; index++) {
            string += row[index].piece;
            let squarePiece = row[index].piece;
            rowSquares[index].textContent = squarePiece === "." ?  " " : squarePiece;
          }
          printedBoard += string + "\n";
        }
        console.log(printedBoard);
      };
  
      let placePiece = ({ row: row, column: column, piece: piece }) => {
        gameboard[row][column] = gameboard[row][column].updatePiece(piece);
        printBoard();
      };
  
      let availableSpaces = () => {
        const cells = gameboard.flat();
        return cells.filter((cell) => cell.piece === ".");
      };
  
      return { gameboard, placePiece, availableSpaces };
    }());
    console.log("Welcome to Tic Tac Toe");
    const players = createPlayers();
    const order = createOrder(players);
    const player1 = order[0];
    console.log(
      `Player1 is ${player1.name} and is playing with ${player1.symbol}`
    );
    const player2 = order[1];
    console.log(
      `Player2 is a ${player2.name} and is playing with ${player2.symbol}`
    );

    let currentTurn = 1;

    while (currentTurn < 10 && isWon(gameboard.gameboard) === false) {
      let player = order[0]
      order.push(player)
      await player.playTurn(gameboard);
      if (isWon(gameboard.gameboard) === true) {
        let body = document.querySelector('body')
        let div = document.createElement('div')
        div.className = 'result'
        div.textContent = `${player.name} won`
        body.appendChild(div)
        console.log(`${player.name} won`);
      }
        currentTurn++;
        order.shift();
    }
    isWon(gameboard.gameboard) ? void 0 : console.log("Stalemate!");
  }

  function createPlayers() {
    return [
      createPlayer(prompt("What is your name?"), "x", false),
      createPlayer("computer", "o", true),
    ];
  }

  function isWon(gameboard) {
    function isVerticalWin() {
      let gameboardColumns = [
        [gameboard[0][0], gameboard[1][0], gameboard[2][0]],
        [gameboard[0][1], gameboard[1][1], gameboard[2][1]],
        [gameboard[0][2], gameboard[1][2], gameboard[2][2]],
      ];

      return gameboardColumns.some((column) => {
        let pieceString = column.map((cell) => cell.piece).join("");
        return pieceString === "xxx" || pieceString === "ooo";
      });
    }

    function isHorizontalWin() {
      let gameboardRows = gameboard;
      return gameboardRows.some((row) => {
        let pieceString = row.map((cell) => cell.piece).join("");
        return pieceString === "xxx" || pieceString === "ooo";
      });
    }

    function isDiagonalWin() {
      let gameboardDiagonals = [
        [gameboard[0][0], gameboard[1][1], gameboard[2][2]],
        [gameboard[2][0], gameboard[1][1], gameboard[0][2]],
      ];
      return gameboardDiagonals.some((diagonal) => {
        let pieceString = diagonal.map((cell) => cell.piece).join("");
        return pieceString === "xxx" || pieceString === "ooo";
      });
    }
    const winTypes = [isVerticalWin(), isHorizontalWin(), isDiagonalWin()];
    return winTypes.some((e) => e === true);
  }

  function createPlayer(name, symbol, isComputer) {
    const getUserInput = (availableSpaces) => {
      
      return new Promise((resolve, reject) =>{
        squares.forEach((square) => {
          square.addEventListener('click', () => {
              const row = parseInt(square.getAttribute("row"));
              const column = parseInt(square.getAttribute("column"));
              const piece = symbol;
              const selectedCell = { row, column, piece };

              if (!availableSpaces.some(cell => cell.row === row && cell.column === column)) {
                  alert("Invalid placement.");
                  reject();
              } else {
                  resolve(selectedCell);
              }
          });
        });
      });
    }
    const playTurn = async (gameboard) => {
      const randomCell = (array) => {
        const cell = array[Math.floor(Math.random() * array.length)];
        const row = cell.row;
        const column = cell.column;
        const piece = symbol;
    return { row, column, piece };
      };
      const availableSpaces = gameboard.availableSpaces();
      if (isComputer) {
        gameboard.placePiece(randomCell(availableSpaces));
      } else {
        try {
          const selectedCell = await getUserInput(availableSpaces);
          gameboard.placePiece(selectedCell);
      } catch (error) {
          console.error(error);
      }
      }
    };
    return { name, symbol, isComputer, playTurn };
  }

  function createOrder(players) {
    let first = players[Math.floor(Math.random() * 2)];
    let second = players.find((player) => player != first);
    return [first, second];
  }
  return { playGame, removeResultMessage, removeSquareListeners };
}

let button = document.querySelector("button");
button.addEventListener("click", () =>{
  game().removeResultMessage();
  game().removeSquareListeners();
  game().playGame()
});

