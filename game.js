// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

let snake = [{x: 200, y: 200}];  // Initial snake position
let food = generateFood();        // First food position
let dx = 20;                      // Horizontal movement
let dy = 0;                       // Vertical movement
let score = 0;                    // Player score
let gameSpeed = 100;              // Game speed in ms
let gameInterval;                 // Game loop interval

// Generate random food position
function generateFood() {
    const foodSize = 20;
    return {
        x: Math.floor(Math.random() * (canvas.width/foodSize)) * foodSize,
        y: Math.floor(Math.random() * (canvas.height/foodSize)) * foodSize
    };
}

// Draw a rectangle (used for snake segments and food)
function drawRect(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 20, 20);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(x, y, 20, 20);
}

// Main game loop
function gameLoop() {
    // Move snake
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    
    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        food = generateFood();
        
        // Increase speed slightly as score increases
        if (score % 5 === 0) {
            clearInterval(gameInterval);
            gameSpeed = Math.max(gameSpeed - 10, 50);
            gameInterval = setInterval(gameLoop, gameSpeed);
        }
    } else {
        snake.pop();
    }
    
    // Check for collisions
    if (checkCollision(head)) {
        gameOver();
        return;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw food
    drawRect(food.x, food.y, 'red');
    
    // Draw snake
    snake.forEach((segment, index) => {
        const color = index === 0 ? 'darkgreen' : 'green'; // Head is darker
        drawRect(segment.x, segment.y, color);
    });
}

// Check for collisions
function checkCollision(head) {
    return (
        // Wall collision
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height ||
        // Self collision
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    );
}

// Game over function
function gameOver() {
    clearInterval(gameInterval);
    alert(`Game Over! Your score: ${score}\nPress OK to restart.`);
    resetGame();
}

// Reset game state
function resetGame() {
    snake = [{x: 200, y: 200}];
    food = generateFood();
    dx = 20;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    gameSpeed = 100;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
}

// Keyboard controls
document.addEventListener('keydown', e => {
    // Prevent reverse movement
    if (e.key === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -20;
    } else if (e.key === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = 20;
    } else if (e.key === 'ArrowLeft' && dx === 0) {
        dx = -20;
        dy = 0;
    } else if (e.key === 'ArrowRight' && dx === 0) {
        dx = 20;
        dy = 0;
    }
});

// Start the game
gameInterval = setInterval(gameLoop, gameSpeed);