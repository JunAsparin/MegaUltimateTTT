<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Multiplayer Menu</title>
  <link rel="stylesheet" href="common.css" />
</head>
<body>
  <div class="menu-container">
    <h1>Multiplayer Tic Tac Toe</h1>
    <button onclick="hostGame()">Host Game</button>
    <div>
      <input type="text" id="join-code" placeholder="Enter Game Code" />
      <button onclick="joinGame()">Join Game</button>
    </div>
    <p id="menu-status"></p>
  </div>

  <script type="module" src="menu.js"></script>
</body>
</html>
