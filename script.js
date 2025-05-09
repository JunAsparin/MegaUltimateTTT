// script.js

// Game state variables
let currentPlayer = "X";
let activeUltimate = null;
let activeMini = null;

const structure = Array(9).fill(null).map(() =>
  Array(9).fill(null).map(() =>
    Array(9).fill("")
  )
);
const miniWinners = Array(9).fill(null).map(() => Array(9).fill(""));
const ultimateWinners = Array(9).fill("");

let roomCode = null;
let isHost = false;

const mainBoard = document.getElementById("main-board");
const statusText = document.getElementById("status");

// Create the game board
function createGame() {
  mainBoard.innerHTML = '';
  
  for (let i = 0; i < 9; i++) {
    const ultimateCell = document.createElement("div");
    ultimateCell.classList.add("ultimate-cell");
    
    const miniBoard = document.createElement("div");
    miniBoard.classList.add("mini-board");

    for (let j = 0; j < 9; j++) {
      const miniCell = document.createElement("div");
      miniCell.classList.add("mini-cell");
      miniCell.dataset.ultimateIndex = i;
      miniCell.dataset.miniIndex = j;
      miniCell.addEventListener("click", handleMove);
      miniBoard.appendChild(miniCell);
    }
    ultimateCell.appendChild(miniBoard);
    mainBoard.appendChild(ultimateCell);
  }
}

// Handle move on the board
function handleMove(event) {
  const ultimateIndex = event.target.dataset.ultimateIndex;
  const miniIndex = event.target.dataset.miniIndex;

  // Check if the cell is already occupied or if the current player can't move here
  if (structure[ultimateIndex][miniIndex] !== "" || currentPlayer !== "X" && currentPlayer !== "O") {
    return;
  }

  // Update the structure and the displayed board
  structure[ultimateIndex][miniIndex] = currentPlayer;
  event.target.textContent = currentPlayer;

  // Check for mini and ultimate winners
  checkMiniWinner(ultimateIndex, miniIndex);
  checkUltimateWinner(ultimateIndex);

  // Switch players
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.innerHTML = `Player <span class="turn-${currentPlayer.toLowerCase()}">${currentPlayer}</span>'s turn`;

  updateFirebaseState(); // Sync the game state to Firebase
}

// Update Firebase state
function updateFirebaseState() {
  if (!roomCode || !isHost) return;

  const gameState = {
    board: structure,
    currentPlayer,
    miniWinners,
    ultimateWinners,
    activeUltimate,
    activeMini
  };

  // Push the state to Firebase
  set(ref(db, `rooms/${roomCode}`), gameState);
}

// Listen for moves from the other player
function listenForMoves() {
  if (!roomCode || isHost) return;

  const roomRef = ref(db, `rooms/${roomCode}`);
  onValue(roomRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      Object.assign(structure, data.board);
      Object.assign(miniWinners, data.miniWinners);
      Object.assign(ultimateWinners, data.ultimateWinners);
      currentPlayer = data.currentPlayer;
      activeUltimate = data.activeUltimate;
      activeMini = data.activeMini;
      refreshBoard();
    }
  });
}

// Refresh the board with the state from Firebase
function refreshBoard() {
  const cells = document.querySelectorAll('.mini-cell');
  
  cells.forEach(cell => {
    const ultimateIndex = cell.dataset.ultimateIndex;
    const miniIndex = cell.dataset.miniIndex;
    const value = structure[ultimateIndex][miniIndex];
    
    if (value) {
      cell.textContent = value;
    }
  });

  // Update the turn indicator
  statusText.innerHTML = `Player <span class="turn-${currentPlayer.toLowerCase()}">${currentPlayer}</span>'s turn`;
}

// Create a new room (host the game)
function createRoom() {
  roomCode = generateRoomCode();
  isHost = true;
  updateFirebaseState();
  listenForMoves();
  alert(`Room created! Your room code is: ${roomCode}`);
}

// Join an existing room
function joinRoomFromInput() {
  roomCode = document.getElementById("roomCodeInput").value;
  isHost = false;
  listenForMoves();
}

// Generate a random room code
function generateRoomCode() {
  return Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Check if a mini-board has a winner
function checkMiniWinner(ultimateIndex, miniIndex) {
  const miniBoard = structure[ultimateIndex][miniIndex];
  const winner = checkBoardWinner(miniBoard);

  if (winner) {
    miniWinners[ultimateIndex][miniIndex] = winner;
    checkUltimateWinner(ultimateIndex);
  }
}

// Check if the ultimate board has a winner
function checkUltimateWinner(ultimateIndex) {
  const ultimateBoard = miniWinners[ultimateIndex];

  const winner = checkBoardWinner(ultimateBoard);
  if (winner) {
    ultimateWinners[ultimateIndex] = winner;
    checkGameOver();
  }
}

// Check for winner in a board (mini or ultimate)
function checkBoardWinner(board) {
  // Check rows, columns, and diagonals
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // X or O
    }
  }
  return null;
}

// Check if the game is over
function checkGameOver() {
  const winner = ultimateWinners.find(w => w !== null);
  if (winner) {
    alert(`${winner} wins the game!`);
    resetGame();
  }
}

// Reset the game
function resetGame() {
  structure.forEach(board => board.forEach((cell, i) => board[i] = ""));
  miniWinners.forEach(board => board.forEach((cell, i) => board[i] = ""));
  ultimateWinners.fill(null);
  currentPlayer = "X";
  activeUltimate = null;
  activeMini = null;
  updateFirebaseState();
}

// Initialize the game board
createGame();
