// js/main.js

const character = document.getElementById('character');
const scoreDisplay = document.getElementById('score');
const gameOverText = document.getElementById('gameOver');
const gameContainer = document.querySelector('.game-container');

let isJumping = false;
let score = 0;
let gameInterval;
let obstacleTimeout;
let obstacleSpeed = 2000; // Initial obstacle speed in ms
let obstacleFrequency = 2000; // Initial obstacle spawn frequency in ms
const difficultyIncrement = 30; // Increase difficulty every 100 points
const minObstacleSpeed = 800; // Minimum obstacle speed in ms
const minObstacleFrequency = 800; // Minimum spawn frequency in ms

// Handle jump
function jump() {
    if (isJumping) return;
    isJumping = true;
    character.classList.add('jumping');
    setTimeout(() => {
        character.classList.remove('jumping');
        isJumping = false;
    }, 600);
}

// Handle key press
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        jump();
    }
});

// Handle mouse/touch click
document.addEventListener('click', jump);
document.addEventListener('touchstart', jump);

// Spawn obstacles at random intervals
function spawnObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    gameContainer.appendChild(obstacle);

    // Set animation duration based on current obstacleSpeed
    obstacle.style.animationDuration = `${obstacleSpeed / 1000}s`;

    // Remove obstacle after it moves out of view
    obstacle.addEventListener('animationend', () => {
        obstacle.remove();
    });

    // Check collision for the new obstacle
    checkCollision(obstacle);

    // Schedule next obstacle spawn with random delay
    scheduleNextObstacle();
}

// Schedule the next obstacle spawn with random delay
function scheduleNextObstacle() {
    // Random delay between 0.5x and 1.5x the current obstacleFrequency
    const randomDelay = obstacleFrequency * (0.5 + Math.random());
    obstacleTimeout = setTimeout(spawnObstacle, randomDelay);
}

// Collision detection for a specific obstacle
function checkCollision(obstacle) {
    const collisionCheck = setInterval(() => {
        const characterRect = character.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
            characterRect.right > obstacleRect.left &&
            characterRect.left < obstacleRect.right &&
            characterRect.bottom > obstacleRect.top
        ) {
            endGame();
            clearInterval(collisionCheck);
        }

        // If obstacle is out of view, stop checking
        if (obstacleRect.right < 0) {
            clearInterval(collisionCheck);
        }
    }, 10);
}

// Increase difficulty by increasing speed and frequency
function increaseDifficulty() {
    if (score > 0 && score % difficultyIncrement === 0) {
        // Decrease obstacle speed to a minimum of minObstacleSpeed
        if (obstacleSpeed > minObstacleSpeed) {
            obstacleSpeed -= 200; // Increase speed more significantly
        }

        // Decrease obstacle spawn frequency to a minimum of minObstacleFrequency
        if (obstacleFrequency > minObstacleFrequency) {
            obstacleFrequency -= 200; // Increase spawn rate more significantly
        }
    }
}

// Update score and difficulty
function startGame() {
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    gameOverText.style.display = 'none';
    obstacleSpeed = 2000;
    obstacleFrequency = 2000;

    // Clear any existing obstacles and timeouts
    clearTimeout(obstacleTimeout);
    const existingObstacles = document.querySelectorAll('.obstacle');
    existingObstacles.forEach(obstacle => obstacle.remove());

    // Start spawning the first obstacle
    scheduleNextObstacle();

    // Start game loop
    gameInterval = setInterval(() => {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        increaseDifficulty();
    }, 100);
}

function endGame() {
    clearInterval(gameInterval);
    clearTimeout(obstacleTimeout);
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => obstacle.remove());
    gameOverText.style.display = 'block';
}

// Restart game on click after game over
gameOverText.addEventListener('click', startGame);
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && gameOverText.style.display === 'block') {
        startGame();
    }
});

// Start the game initially
startGame();

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}
