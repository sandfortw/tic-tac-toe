function game() {
  function createGameboard() {
    function createCell(row, column) {
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
        let string = "";
        row.forEach((cell) => {
          string += cell.piece;
        });
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
  }

  function playGame() {
    let gameboard = createGameboard();
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
      player.playTurn(gameboard);
      if (isWon(gameboard.gameboard) === true) {
        console.log(`${player.name} won`);
      }
        currentTurn++;
        order.shift();
    }
    isWon(gameboard.gameboard) ? void 0 : console.log("Stalemate!");
  }

  function createPlayers() {
    return [
      createPlayer("human", "x", false),
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
      //todo: change this when ui implemented

      const placementValid = () => {
        return availableSpaces.some((availableCell) => {
          let x =
            selectedCell.row == availableCell.row &&
            selectedCell.column == availableCell.column;
          return x;
        });
      };
      do {
        var row = prompt("Select Row");
        var column = prompt("Select Column");
        let piece = symbol;
        var selectedCell = { row, column, piece };
        var placementIsValid = placementValid(selectedCell);
        if (placementIsValid === false) {
          alert("Invalid placement.");
        }
      } while (placementIsValid === false);

      return selectedCell;
    };
    const playTurn = (gameboard) => {
      const randomCell = (array) => {
        const cell = array[Math.floor(Math.random() * (array.length - 1))];
        const row = cell.row;
        const column = cell.column;
        const piece = symbol;
        return { row, column, piece };
      };
      const availableSpaces = gameboard.availableSpaces();
      if (isComputer === true) {
        gameboard.placePiece(randomCell(availableSpaces));
      } else {
        gameboard.placePiece(getUserInput(availableSpaces));
      }
    };
    return { name, symbol, isComputer, playTurn };
  }

  function createOrder(players) {
    let first = players[(() => Math.floor(Math.random() * 2))()];
    let second = players.find((player) => player != first);
    return [first, second];
  }
  return { playGame };
}

let button = document.querySelector("button");
button.addEventListener("click", () => game().playGame());
