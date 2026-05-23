const icons = ["🍒", "🍋", "🍇", "🍉", "⭐", "🌙", "🔥", "🌿"];
const board = document.getElementById("gameBoard");
const movesText = document.getElementById("moves");
const matchesText = document.getElementById("matches");
const totalPairsText = document.getElementById("totalPairs");
const message = document.getElementById("message");
const restartButton = document.getElementById("restartButton");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;

// Fisher-Yates shuffle algorithm
function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

// Dynamically generate cards
function createCard(icon) {
  const card = document.createElement("button");
  card.className = "card";
  card.type = "button";
  card.dataset.icon = icon;
  card.setAttribute("aria-label", "Hidden card");
  
  card.innerHTML = `
    <span class="card-inner">
      <span class="card-face card-back" aria-hidden="true"></span>
      <span class="card-face card-front" aria-hidden="true">${icon}</span>
    </span>
  `;
  
  card.addEventListener("click", () => flipCard(card));
  return card;
}

// Start and initialize the game
function startGame() {
  const deck = shuffle([...icons, ...icons]);
  
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  moves = 0;
  matches = 0;
  
  movesText.textContent = moves;
  matchesText.textContent = matches;
  totalPairsText.textContent = icons.length;
  message.textContent = "";
  
  // Clear the game board and insert newly created cards
  board.replaceChildren(...deck.map(createCard));
}

// Card flip handler
function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains("matched")) return;
  
  card.classList.add("flipped");
  card.setAttribute("aria-label", `Revealed ${card.dataset.icon}`);
  
  if (!firstCard) {
    firstCard = card;
    return;
  }
  
  secondCard = card;
  moves += 1;
  movesText.textContent = moves;
  checkForMatch();
}

// Check whether the cards match
function checkForMatch() {
  if (firstCard.dataset.icon === secondCard.dataset.icon) {
    keepMatchedCards();
    return;
  }
  hideCards();
}

// Handle matched cards
function keepMatchedCards() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");
  firstCard.disabled = true;
  secondCard.disabled = true;
  
  matches += 1;
  matchesText.textContent = matches;
  resetTurn();
  
  if (matches === icons.length) {
    message.textContent = `You won in ${moves} moves!`;
  }
}

// Handle unmatched cards (flip them back)
function hideCards() {
  lockBoard = true;
  window.setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    firstCard.setAttribute("aria-label", "Hidden card");
    secondCard.setAttribute("aria-label", "Hidden card");
    resetTurn();
  }, 800);
}

// Reset turn state
function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// Register event listeners and start the game
restartButton.addEventListener("click", startGame);
startGame();