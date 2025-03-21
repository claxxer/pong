const canvas = document.querySelector('#pong');
const paddle1 = document.querySelector('#paddle1');
const paddle2 = document.querySelector('#paddle2');
const ball = document.querySelector('#ball');
const controlsButton = document.querySelector('#controls');
const controlsInfo = document.querySelector('#controlsInfo');
const startGameButton = document.querySelector('#startGame');

let paddle1Y = 240; 
let paddle2Y = 240; 
let paddleSpeed = 8.5; // Increased speed by 1.7x
let ballSpeedX = 4.25; // Increased speed by 1.7x
let ballSpeedY = 4.25; // Increased speed by 1.7x
let ballX = 595; 
let ballY = 290; 
let ballDirectionX = 1;
let ballDirectionY = 1;

const paddleHeight = 120; 
const paddleWidth = 10;
const ballSize = 12;

let gameRunning = false; // Track if the game is running

let p1MovingUp = false;
let p1MovingDown = false;
let p2MovingUp = false;
let p2MovingDown = false;

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function handleKeyDown(event) {
    if (!gameRunning) return; // Prevent controls if the game is not running
    if (event.key === 'w' || event.key === 'W') p1MovingUp = true;
    if (event.key === 's' || event.key === 'S') p1MovingDown = true;

    if (event.key === 'ArrowUp') p2MovingUp = true;
    if (event.key === 'ArrowDown') p2MovingDown = true;
}

function handleKeyUp(event) {
    if (event.key === 'w' || event.key === 'W') p1MovingUp = false;
    if (event.key === 's' || event.key === 'S') p1MovingDown = false;
    if (event.key === 'ArrowUp') p2MovingUp = false;
    if (event.key === 'ArrowDown') p2MovingDown = false;
}

function movePaddles() {
    if (p1MovingUp && paddle1Y > 0) paddle1Y -= paddleSpeed;
    if (p1MovingDown && paddle1Y < canvas.clientHeight - paddleHeight) paddle1Y += paddleSpeed;

    if (p2MovingUp && paddle2Y > 0) paddle2Y -= paddleSpeed;
    if (p2MovingDown && paddle2Y < canvas.clientHeight - paddleHeight) paddle2Y += paddleSpeed;

    paddle1.style.top = `${paddle1Y}px`;
    paddle2.style.top = `${paddle2Y}px`;
}

function moveBall() {
    ballX += ballSpeedX * ballDirectionX;
    ballY += ballSpeedY * ballDirectionY;

    if (ballY <= 0 || ballY >= canvas.clientHeight - ballSize) {
        ballDirectionY = -ballDirectionY;
    }

    if (ballX <= paddleWidth && ballY >= paddle1Y && ballY <= paddle1Y + paddleHeight) {
        ballDirectionX = 1;
        const paddleCenter = paddle1Y + paddleHeight / 2;
        const hitPosition = ballY - paddleCenter;
        ballDirectionY = hitPosition / (paddleHeight / 2);
    }

    if (ballX >= canvas.clientWidth - paddleWidth - ballSize && ballY >= paddle2Y && ballY <= paddle2Y + paddleHeight) {
        ballDirectionX = -1;
        const paddleCenter = paddle2Y + paddleHeight / 2;
        const hitPosition = ballY - paddleCenter;
        ballDirectionY = hitPosition / (paddleHeight / 2);
    }

    if (ballX <= 0 || ballX >= canvas.clientWidth - ballSize) {
        resetBall();
    }

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
}

function resetBall() {
    ballX = canvas.clientWidth / 2 - ballSize / 2;
    ballY = canvas.clientHeight / 2 - ballSize / 2;
    ballDirectionX = ballDirectionX === 1 ? -1 : 1;
    ballDirectionY = 1;
}

function gameLoop() {
    if (!gameRunning) return; // Only run game loop if the game is running
    movePaddles();
    moveBall();
    requestAnimationFrame(gameLoop);
}

function toggleControls() {
    controlsInfo.style.display = controlsInfo.style.display === 'none' ? 'block' : 'none';
}

function startGame() {
    gameRunning = true; // Start the game
    startGameButton.style.display = 'none'; // Hide the start button
    gameLoop(); // Start the game loop
}

gameRunning = false; // Ensure the game does not start immediately
startGameButton.style.display = 'block'; // Show the start game button
