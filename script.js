import { playerData, enemyData } from './js/settings.js';
// import * as elements from './js/elements.js';
import { initialize } from './js/initialize.js';
import { gameState } from './js/state.js';
import { characterMove } from './js/movement.js';
import { chargeGauge,  enemyChargeGauge} from './js/gauge.js';
import { shotProcess } from './js/attack.js';
import { stopAllTimers } from './js/stop.js';



initialize();
stopAllTimers()

const modalStartButton = document.getElementById('modalStartButton')
const mask = document.getElementById('mask')
const modal = document.getElementById('modal')
const modalClearGame = document.getElementById('modalClearGame')
const modalNextGame = document.getElementById('modalNextGame')

// スタートボタンをクリックした時
modalStartButton.addEventListener('click', () => {
  mask.classList.add('deactive');
  modal.classList.add('deactive')
  characterMove(playerData.speed, enemyData.speed);
  // characterMove(enemyData.speed,enemy)
  chargeGauge();
  enemyChargeGauge()
})


// 次へ進むボタンを押した時
modalNextGame.addEventListener('click', () => {
  mask.classList.add('deactive');
  modalClearGame.classList.add('deactive')
  gameState.gameFinish = false;
  gameState.invincible = true; 
  playerData.shotSettings.normal.enable = true;
  setTimeout(() => {
    gameState.invincible = false;
  }, 4000);
  
  characterMove(playerData.speed, enemyData.speed);

  chargeGauge();
  enemyChargeGauge()
})



shotProcess (
  playerData.shotSettings.normal, 
  'a', 
  playerData.shotSettings.normal.cost, 
  normalAttackElement, 
  playerData.shotSettings.normal.speed,
  playerData.shotSettings.normal.hitRangeFront, 
  playerData.shotSettings.normal.hitRangeBack
)






