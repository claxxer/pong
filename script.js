const suits = ["hearts", "diamonds", "clubs", "spades"];
const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

let playerDeck = [];
let centerPiles = [{}, {}]; // Two piles in the center

const playerDeckElement = document.getElementById("playerDeck");
const pile1Element = document.getElementById("pile1");
const pile2Element = document.getElementById("pile2");

const restartButton = document.getElementById("restartBtn");

// Create a deck of cards
function createDeck() {
  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

// Shuffle and deal cards
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// Initialize the game
function initializeGame() {
  const deck = shuffleDeck(createDeck());

  // Give half the deck to the player
  playerDeck = deck.slice(0, Math.floor(deck.length / 2));
  playerDeckElement.innerHTML = '';
  
  // Display player's cards
  playerDeck.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.innerText = `${card.rank} of ${card.suit}`;
    cardElement.addEventListener('click', () => playCard(card));
    playerDeckElement.appendChild(cardElement);
  });

  // Clear center piles
  pile1Element.innerHTML = '';
  pile2Element.innerHTML = '';
}

// Play a card from the player's deck
function playCard(card) {
  const pile1Card = centerPiles[0].card;
  const pile2Card = centerPiles[1].card;
  
  if (isValidMove(card, pile1Card)) {
    placeCardInPile(card, 0);
  } else if (isValidMove(card, pile2Card)) {
    placeCardInPile(card, 1);
  } else {
    alert("Invalid move, try again!");
  }
}

// Check if a move is valid (cards can be placed on the pile if they are one rank higher or lower)
function isValidMove(card, pileCard) {
  if (!pileCard) return true;
  const validRanks = [ranks.indexOf(card.rank) - 1, ranks.indexOf(card.rank) + 1];
  return validRanks.includes(ranks.indexOf(pileCard.rank));
}

// Place a card in a pile
function placeCardInPile(card, pileIndex) {
  centerPiles[pileIndex].card = card;
  const pileElement = pileIndex === 0 ? pile1Element : pile2Element;
  
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');
  cardElement.innerText = `${card.rank} of ${card.suit}`;
  pileElement.appendChild(cardElement);

  // Remove the card from the player's deck
  playerDeck = playerDeck.filter(c => c !== card);
  playerDeckElement.innerHTML = '';
  
  // Redraw the player's deck
  playerDeck.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.innerText = `${card.rank} of ${card.suit}`;
    cardElement.addEventListener('click', () => playCard(card));
    playerDeckElement.appendChild(cardElement);
  });
}

// Restart the game
restartButton.addEventListener("click", initializeGame);

// Initialize the game on load
initializeGame();
