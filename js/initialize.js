
import { gameState } from './state.js';

const normalShot = document.getElementById("normalShot")
const bigShot = document.getElementById("bigShot")
const curveShot = document.getElementById("curveShot")
const enemySpeedShot = document.getElementById("enemySpeedShot")
const enemyInvincible = document.getElementById("enemyInvincible")
const modalClearGame = document.getElementById("modalClearGame")
const modalStartButton = document.getElementById("modalStartButton")

export function initialize() {
  normalShot.classList.add('deactive');
  bigShot.style.display = 'none';
  curveShot.style.display = 'none';
  enemySpeedShot.style.display = 'none';
  enemyInvincible.style.display = 'none';
  modalClearGame.classList.add('deactive');
  modalStartButton.textContent = 'ゲームスタート';

  gameState.playerPosition = 50;
  gameState.enemyPosition = 50;
  gameState.chargeTimer = 0;
  gameState.enemyChargeTimer = 0;
  gameState.gameFinish = false;
}