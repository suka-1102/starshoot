import * as elements from './elements.js';
import { gameState, timers } from './state.js';

export function characterMove(playerSpeed, enemySpeed) {
  let playerPlus = true;
  let enemyPlus = false;
  let lastTime = performance.now();

  timers.enemyTurnInterval = setInterval(() => {
    const turnNumber = Math.random() * 100;
    enemyPlus = turnNumber < 50;
  }, 2000);

  function move(now) {
    if (gameState.gameFinish) return;
    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    const playerDistance = playerSpeed * deltaTime * 60;
    const enemyDistance = enemySpeed * deltaTime * 60;

    // プレイヤー操作
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') playerPlus = true;
      if (event.key === 'ArrowLeft') playerPlus = false;
    });

    gameState.playerPosition += playerPlus ? playerDistance : -playerDistance;
    gameState.enemyPosition += enemyPlus ? enemyDistance : -enemyDistance;

    if (gameState.playerPosition >= 96) playerPlus = false;
    if (gameState.playerPosition <= 4) playerPlus = true;
    if (gameState.enemyPosition >= 96) enemyPlus = false;
    if (gameState.enemyPosition <= 4) enemyPlus = true;

    elements.player.style.left = `${gameState.playerPosition}%`;
    elements.enemy.style.left = `${gameState.enemyPosition}%`;

    timers.moveRequestId = requestAnimationFrame(move);
  }

  timers.moveRequestId = requestAnimationFrame(move);
}