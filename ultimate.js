const mainBoard = document.getElementById("main-board");
const statusText = document.getElementById("status");

let currentPlayer = "X";
let activeMini = null;
let structure = Array(9).fill("").map(() => Array(9).fill(""));
let miniWinners = Array(9).fill("");

// Reload game functionality
function reloadGame() {
  location.reload();  // This will reload the page
}

// Go to home functionality (modify with your actual home page URL)
function goToHome() {
  window.location.href = "index.html";  // Modify this to your actual home page URL
}

function createGame() {
  for (let m = 0; m < 9; m++) {
    const mini = document.createElement("div");
    mini.classList.add("mini-board");
    mini.dataset.mini = m;

    for (let c = 0; c < 9; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.cell = c;
      cell.addEventListener("click", () => handleMove(m, c, cell));
      mini.appendChild(cell);
    }

    mainBoard.appendChild(mini);
  }
  highlightActiveBoard();
}

function handleMove(m, c, cellEl) {
  if (miniWinners[m] || structure[m][c] !== "") return;
  if (activeMini !== null && m !== activeMini) return;

  structure[m][c] = currentPlayer;
  cellEl.textContent = currentPlayer;
  cellEl.classList.add(currentPlayer.toLowerCase());

  const miniWinner = checkWinner(structure[m]);
  if (miniWinner) {
    miniWinners[m] = miniWinner;
    markBoardWinner(m, miniWinner);

    // 🔴 REMOVE this line to stop highlighting small cells
    // const winningCells = getWinningCells(structure[m]);
    // highlightWinningCells(winningCells);

    const gameWinner = checkWinner(miniWinners);
    if (gameWinner) {
      statusText.textContent = `Player ${gameWinner} wins the whole game!`;
      markUltimateWinner(gameWinner);

      const winningBoards = getWinningBoards(miniWinners);
      highlightWinningBoards(winningBoards); // ✅ Keep this for big boards

      disableAll();
      return;
    }

    activeMini = null;
  } else {
    const nextMini = c;
    if (miniWinners[nextMini] || !structure[nextMini].includes("")) {
      activeMini = null;
    } else {
      activeMini = nextMini;
    }
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.innerHTML = `Player <span class="player-${currentPlayer.toLowerCase()}">${currentPlayer}</span>'s turn`;
  highlightActiveBoard();
}


function highlightActiveBoard() {
  document.querySelectorAll(".mini-board").forEach(board =>
    board.classList.remove("active")
  );

  if (activeMini !== null) {
    const mini = document.querySelectorAll(".mini-board")[activeMini];
    if (mini && !miniWinners[activeMini]) {
      mini.classList.add("active");
    }
  } else {
    document.querySelectorAll(".mini-board").forEach((mini, i) => {
      if (!miniWinners[i]) mini.classList.add("active");
    });
  }
}

function markBoardWinner(m, winner) {
  const mini = document.querySelectorAll(".mini-board")[m];

  const winnerMark = document.createElement("div");
  winnerMark.classList.add("winner-mark", `winner-${winner}`);
  winnerMark.textContent = winner;
  mini.appendChild(winnerMark);

  mini.classList.add(`won-${winner}`);
}

function markUltimateWinner(winner) {
  const overlay = document.createElement("div");
  overlay.classList.add("ultimate-winner-mark", `winner-${winner}`);
  overlay.textContent = winner;
  mainBoard.appendChild(overlay);
}

function disableAll() {
  document.querySelectorAll(".cell").forEach(cell =>
    cell.classList.add("disabled")
  );
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


function getWinningBoards(miniWinners) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8]
  ];

  for (const [a, b, c] of lines) {
    if (miniWinners[a] && miniWinners[a] === miniWinners[b] && miniWinners[a] === miniWinners[c]) {
      return [a, b, c]; // Return the winning boards
    }
  }
  return [];
}

function highlightWinningBoards(boards) {
  boards.forEach(board => {
    const mini = document.querySelectorAll(".mini-board")[board];
    mini.classList.add("rainbow-strobe");
  });
}

createGame();
