let currentPlayer = "X";
let gameOver = false;
let gameId = null;
let isHost = false;
let unsubscribe = null;


const statusText = document.getElementById("status");
const regularBoard = document.getElementById("main-board");


function createBoard() {
  regularBoard.innerHTML = ""; // Clear the board before creating a new one
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => handleMove(cell, i));
    regularBoard.appendChild(cell);
  }
}

async function handleMove(cell, index) {
  if (gameOver || cell.classList.contains("disabled") || !gameId) return;

  const gameRef = db.collection("games").doc(gameId);
  const doc = await gameRef.get();
  const data = doc.data();

  if (data.board[index] !== "" || data.currentPlayer !== currentPlayer) return;

  data.board[index] = currentPlayer;
  data.currentPlayer = currentPlayer === "X" ? "O" : "X";

  await gameRef.update(data);
}


function checkWinner() {
  const cells = document.querySelectorAll(".cell");
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (
      cells[a].textContent &&
      cells[a].textContent === cells[b].textContent &&
      cells[a].textContent === cells[c].textContent
    ) {
      // Apply the winner class to the winning cells to trigger the strobe effect
      cells[a].classList.add("winner");
      cells[b].classList.add("winner");
      cells[c].classList.add("winner");
      return true;
    }
  }
  return false;
}

function reloadGame() {
  location.reload();
}


function goToHome() {
  window.location.href = "index.html"; // Adjust this path if needed
}

// Initialize the game
createBoard();
statusText.innerHTML = `Player <span class="player-${currentPlayer.toLowerCase()}">${currentPlayer}</span>'s turn`;

async function hostGame() {
  const gameRef = await db.collection("games").add({
    board: Array(9).fill(""),
    currentPlayer: "X",
    gameOver: false
  });

  gameId = gameRef.id;
  isHost = true;
  alert(`Share this code: ${gameId}`);
  listenForChanges();
}

async function joinGame(code) {
  const gameRef = db.collection("games").doc(code);
  const doc = await gameRef.get();

  if (!doc.exists) {
    alert("Game not found!");
    return;
  }

  gameId = code;
  isHost = false;
  listenForChanges();
}

function listenForChanges() {
  unsubscribe = db.collection("games").doc(gameId).onSnapshot((doc) => {
    const data = doc.data();
    updateBoard(data.board);
    currentPlayer = data.currentPlayer;
    gameOver = data.gameOver;
    statusText.innerHTML = gameOver
      ? `Game Over`
      : `Player <span class="player-${currentPlayer.toLowerCase()}">${currentPlayer}</span>'s turn`;
  });
}

function updateBoard(board) {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell, i) => {
    cell.textContent = board[i];
    cell.classList.add("disabled");
    if (board[i] === "X") cell.classList.add("x");
    if (board[i] === "O") cell.classList.add("o");
  });
}

