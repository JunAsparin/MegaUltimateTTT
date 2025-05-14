let currentPlayer = "X";
let gameOver = false;

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

function handleMove(cell, index) {
  if (gameOver || cell.classList.contains("disabled")) return;

  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());
  cell.classList.add("disabled");

  // Check for a win after the move
  if (checkWinner()) {
    gameOver = true;
    statusText.textContent = `Player ${currentPlayer} wins!`;
    addReloadButton(); // Show the reload button
    addHomeButton();   // Show the home button
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerHTML = `Player <span class="player-${currentPlayer.toLowerCase()}">${currentPlayer}</span>'s turn`;
  }
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

