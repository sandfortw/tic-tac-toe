function createGameboard() {
  function createCell(x, y){
    const piece = ""
    return {x, y, piece}
  }
  let gameBoard = [
    createCell(0, 2), createCell(1, 2), createCell(2, 2),
    createCell(0, 1), createCell(1, 1), createCell(2, 1),
    createCell(0, 0), createCell(1, 0), createCell(2, 0)
  ]

  return {gameBoard}
}

function playGame(){
  const players = createPlayers()
  const order = createOrder(players)
  const player1 = order.first 
  const player2 = order.second
  let currentPlayer = player1
  while(!game.isWon()){
    currentPlayer.playTurn()
    currentPlayer = player1 ? player2 : player1
    console.log(gameBoard)
  }
  return winMessage(game.winner)
}

function createPlayers(){
  return [createPlayer("player", "x", false), createPlayer("computer", "o", true)]
}

function createPlayer(name, symbol, isComputer){
  const playTurn = () => {
    const availableSpaces = availableSpaces()
    if(isComputer === 'computer'){
      gameBoard.placePiece(randomCell(availableSpaces()))
    } else {
      gameBoard.placePiece(getUserInput())
    }
  }
  return {name, symbol, isComputer, playTurn}
}

function createOrder(players){
  first = players[(() => Math.floor(Math.random() * 2))]
  second = players.find((player) => player != first)
  return {first, second}
}

