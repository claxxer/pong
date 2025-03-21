const gridSize = 10; // 10x10 grid
const mineCount = 15; // Number of mines

let grid = [];
let revealedCells = 0;
let isGameOver = false;

// Create the game grid
function createGrid() {
  grid = [];
  for (let i = 0; i < gridSize; i++) {
    const row = [];
    for (let j = 0; j < gridSize; j++) {
      row.push({
        isMine: false,
        revealed: false,
        neighboringMines: 0,
      });
    }
    grid.push(row);
  }
  
  // Place mines randomly
  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    if (!grid[x][y].isMine) {
      grid[x][y].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate neighboring mines for each cell
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (grid[x][y].isMine) continue;
      grid[x][y].neighboringMines = countNeighboringMines(x, y);
    }
  }
}

// Count neighboring mines for a given cell
function countNeighboringMines(x, y) {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];
  let count = 0;
  directions.forEach(([dx, dy]) => {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize && grid[nx][ny].isMine) {
      count++;
    }
  });
  return count;
}

// Render the grid
function renderGrid() {
  const gridContainer = document.getElementById('minesweeperGrid');
  gridContainer.innerHTML = '';
  
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      
      if (grid[x][y].revealed) {
        cellElement.classList.add('revealed');
        if (grid[x][y].isMine) {
          cellElement.classList.add('mine');
        } else if (grid[x][y].neighboringMines > 0) {
          cellElement.innerText = grid[x][y].neighboringMines;
        }
      }
      
      cellElement.addEventListener('click', () => handleCellClick(x, y));
      gridContainer.appendChild(cellElement);
    }
  }
}

// Handle cell click
function handleCellClick(x, y) {
  if (isGameOver || grid[x][y].revealed) return;
  
  grid[x][y].revealed = true;
  revealedCells++;

  if (grid[x][y].isMine) {
    gameOver(false); // Game over, player clicked a mine
  } else {
    if (grid[x][y].neighboringMines === 0) {
      revealAdjacentCells(x, y);
    }
  }
  
  renderGrid();
  
  // Check if the player has won
  if (revealedCells === gridSize * gridSize - mineCount) {
    gameOver(true); // Player wins
  }
}

// Reveal adjacent cells (if they are safe)
function revealAdjacentCells(x, y) {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];

  directions.forEach(([dx, dy]) => {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize && !grid[nx][ny].revealed) {
      grid[nx][ny].revealed = true;
      revealedCells++;
      if (grid[nx][ny].neighboringMines === 0) {
        revealAdjacentCells(nx, ny);
      }
    }
  });
}

// End the game (win or lose)
function gameOver(isWin) {
  isGameOver = true;
  alert(isWin ? "You win!" : "Game over! You hit a mine.");
}

// Restart the game
document.getElementById('restartBtn').addEventListener('click', () => {
  isGameOver = false;
  revealedCells = 0;
  createGrid();
  renderGrid();
});

// Initialize the game
createGrid();
renderGrid();
