// এলিমেন্ট সিলেকশন
const board = document.getElementById("board");
const rollBtn = document.getElementById("rollBtn");
const diceEl = document.getElementById("dice");
const diceValueEl = document.getElementById("diceValue");
const currentPlayerEl = document.getElementById("currentPlayer");
const timerEl = document.getElementById("timer");
const p1PointsEl = document.getElementById("p1Points");
const p2PointsEl = document.getElementById("p2Points");

// প্রাথমিক ভ্যারিয়েবল
let currentPlayer = 1;
let time = 180;
let isRolling = false;

// প্লেয়ার ডেটা
const players = {
  1: { tokens: [0, 0, 0, 0], points: 0 },
  2: { tokens: [0, 0, 0, 0], points: 0 },
};

// বোর্ড তৈরি
for (let i = 0; i < 64; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  board.appendChild(cell);
}

// ডাইস ঘোরানোর লজিক
rollBtn.addEventListener("click", () => {
  if (isRolling) return;
  isRolling = true;

  diceEl.style.transform = "rotate(720deg)";
  setTimeout(() => {
    const dice = Math.floor(Math.random() * 6) + 1;
    diceValueEl.textContent = dice;
    moveToken(currentPlayer, dice);
    diceEl.style.transform = "rotate(0deg)";
    switchPlayer();
    isRolling = false;
  }, 600);
});

// টোকেন সরানো
function moveToken(player, steps) {
  const data = players[player];
  let tokenIndex = Math.floor(Math.random() * 4); // এলোমেলো গুটি
  data.tokens[tokenIndex] += steps;
  if (data.tokens[tokenIndex] > 63) data.tokens[tokenIndex] = 63;

  data.points += steps; // প্রতি ঘরে ১ পয়েন্ট

  // প্রতিপক্ষের গুটি খাওয়া
  const opponent = player === 1 ? 2 : 1;
  for (let i = 0; i < 4; i++) {
    if (players[opponent].tokens[i] === data.tokens[tokenIndex]) {
      players[opponent].tokens[i] = 0;
      data.points += 10;
    }
  }

  renderBoard();
  updateScores();
}

// বোর্ড রেন্ডার
function renderBoard() {
  document.querySelectorAll(".cell").forEach((c) => (c.innerHTML = ""));
  for (let p = 1; p <= 2; p++) {
    players[p].tokens.forEach((pos) => {
      const token = document.createElement("div");
      token.classList.add("token", `player${p}`);
      board.children[pos].appendChild(token);
    });
  }
}

// স্কোর আপডেট
function updateScores() {
  p1PointsEl.textContent = players[1].points;
  p2PointsEl.textContent = players[2].points;
}

// প্লেয়ার পরিবর্তন
function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  currentPlayerEl.textContent = currentPlayer;
}

// টাইমার
const timer = setInterval(() => {
  time--;
  timerEl.textContent = time;
  if (time <= 0) {
    clearInterval(timer);
    checkWinner();
  }
}, 1000);

// বিজয়ী নির্ধারণ
function checkWinner() {
  const p1 = players[1].points;
  const p2 = players[2].points;

  let winner = "";
  if (p1 > p2) winner = "🟥 Player 1";
  else if (p2 > p1) winner = "🟦 Player 2";
  else winner = "🤝 ড্র";

  setTimeout(() => {
    alert(`⏰ সময় শেষ!\nPlayer 1: ${p1} পয়েন্ট\nPlayer 2: ${p2} পয়েন্ট\n🏆 বিজয়ী: ${winner}`);
    if (winner !== "🤝 ড্র") {
      alert(`💰 ${winner} জিতেছে ১৮ টাকা!`);
    }
  }, 500);
}