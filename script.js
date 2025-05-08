const mainBoard = document.getElementById("main-board");
const statusText = document.getElementById("status");

let currentPlayer = "X";
let activeUltimate = 4; // Start from center ultimate board
let activeMini = null;

const structure = Array(9).fill(null).map(() =>
  Array(9).fill(null).map(() =>
    Array(9).fill("")
  )
);
const miniWinners = Array(9).fill(null).map(() => Array(9).fill(""));
const ultimateWinners = Array(9).fill("");

// Initialize the game
function createGame() {
  for (let u = 0; u < 9; u++) {
    const ultimate = document.createElement("div");
    ultimate.classList.add("ultimate-board");
    ultimate.dataset.ultimate = u;

    for (let m = 0; m < 9; m++) {
      const mini = document.createElement("div");
      mini.classList.add("mini-board");
      mini.dataset.mini = m;

      for (let c = 0; c < 9; c++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.cell = c;
        cell.addEventListener("click", () => handleMove(u, m, c, cell));
        mini.appendChild(cell);
      }

      ultimate.appendChild(mini);
    }

    mainBoard.appendChild(ultimate);
  }
  highlightActiveBoard();
}

function handleMove(u, m, c, cellEl) {
  if (ultimateWinners[u] || miniWinners[u][m] || structure[u][m][c] !== "") return;

  // Enforce play only in active ultimate board
  if (u !== activeUltimate) return;

  // Enforce play only in active mini-board if one is locked
  if (activeMini !== null && m !== activeMini) return;

  structure[u][m][c] = currentPlayer;
  cellEl.textContent = currentPlayer;
  cellEl.classList.add(currentPlayer.toLowerCase()); // Adds .x or .o for styling


  // Check mini-board win
  const miniWinner = checkWinner(structure[u][m]);
  if (miniWinner) {
    miniWinners[u][m] = miniWinner;
    markBoardWinner(u, m, miniWinner);

    // Check for ultimate win
    const ultimateWinner = checkWinner(miniWinners[u]);
    if (ultimateWinner) {
      ultimateWinners[u] = ultimateWinner;
      markUltimateWinner(u, ultimateWinner);

      const finalWinner = checkWinner(ultimateWinners);
      if (finalWinner) {
        statusText.textContent = `Player ${finalWinner} wins the whole game!`;
        disableAll();
        return;
      }
    }

    // Move to new ultimate board based on position of won mini-board
    activeUltimate = m;
    activeMini = null;
  } else {
    // Still same ultimate board, next mini-board is based on cell clicked
    activeMini = c;

    // If mini-board is full or won, unlock
    if (
      miniWinners[u][activeMini] ||
      !structure[u][activeMini].includes("")
    ) {
      activeMini = null;
    }
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  highlightActiveBoard();
}

function highlightActiveBoard() {
  document.querySelectorAll(".ultimate-board").forEach(board =>
    board.classList.remove("active")
  );
  document.querySelectorAll(".mini-board").forEach(board =>
    board.classList.remove("active")
  );

  const ultimate = document.querySelectorAll(".ultimate-board")[activeUltimate];
  if (ultimate) {
    ultimate.classList.add("active");
    if (activeMini !== null) {
      const mini = ultimate.children[activeMini];
      if (mini) mini.classList.add("active");
    }
  }
}

function markBoardWinner(u, m, winner) {
  const mini = document.querySelectorAll(".ultimate-board")[u].children[m];
  mini.classList.add(`won-${winner}`);
  Array.from(mini.children).forEach(cell => cell.classList.add("disabled"));
}

function markUltimateWinner(u, winner) {
  const ultimate = document.querySelectorAll(".ultimate-board")[u];
  ultimate.classList.add(`won-${winner}`);
  Array.from(ultimate.querySelectorAll(".cell")).forEach(cell => cell.classList.add("disabled"));
}

function disableAll() {
  document.querySelectorAll(".cell").forEach(cell => cell.classList.add("disabled"));
}

function checkWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}


createGame();
