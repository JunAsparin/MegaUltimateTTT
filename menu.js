import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function generateGameCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

window.hostGame = async function () {
  const code = generateGameCode();
  await set(ref(db, `games/${code}`), {
    host: true,
    board: Array(9).fill(""),
    currentPlayer: "X",
    status: "waiting"
  });

  localStorage.setItem("gameCode", code);
  localStorage.setItem("player", "X");
  window.location.href = "game.html"; // redirect to game screen
};

window.joinGame = async function () {
  const code = document.getElementById("join-code").value.trim().toUpperCase();
  const gameRef = ref(db, `games/${code}`);
  const snapshot = await get(gameRef);

  if (snapshot.exists()) {
    localStorage.setItem("gameCode", code);
    localStorage.setItem("player", "O");
    window.location.href = "game.html";
  } else {
    document.getElementById("menu-status").textContent = "Invalid game code!";
  }
};
