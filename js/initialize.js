import * as elements from './elements.js';
import { gameState } from './state.js';

export function initialize() {
  elements.normalShot.classList.add('deactive');
  elements.bigShot.style.display = 'none';
  elements.curveShot.style.display = 'none';
  elements.enemySpeedShot.style.display = 'none';
  elements.enemyInvincible.style.display = 'none';
  elements.modalClearGame.classList.add('deactive');
  elements.startButton.textContent = 'ゲームスタート';

  gameState.playerPosition = 50;
  gameState.enemyPosition = 50;
  gameState.chargeTimer = 0;
  gameState.enemyChargeTimer = 0;
  gameState.gameFinish = false;
}