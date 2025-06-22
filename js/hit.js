import { gameState } from './state.js';
import { playerData, enemyData } from './settings.js';
import { stopAllTimers } from './stop.js';
import { shotProcess } from './attack.js';
 

export function hitJudgment 
(
  positionFixed,
  isPlayerAttack,
  attackTimer,
  hitRangeFront,
  hitRangeBack
) {
  if (gameState.gameFinish) return;
  if (gameState.invincible) return
  if (isPlayerAttack && gameState.enemyInvincibleFlag) return;
  const enemyLeft = enemy.offsetLeft;
  const playerLeft = player.offsetLeft;
  const positionInPixels = 600 * (positionFixed / 100);
  if (!isPlayerAttack) {
    if (
      attackTimer >= 100 &&
      attackTimer <= 150 &&
      positionInPixels >= playerLeft -hitRangeFront &&
      positionInPixels <= playerLeft + hitRangeBack-5
    ) 
    {

      // ゲームオーバーの処理
      mask.classList.remove('deactive');
      modal.classList.remove('deactive')
      modalClearGame.classList.remove('deactive')    
      modalNextGame.style.display = "none"
      newShot.textContent = ''
      gameState.chargeTimer = 0;
      gameState.enemyChargeTimer = 0;
      gameState.gameFinish = true;
      stopAllTimers();
      playerData.shotSettings.normal.enable = false;
      modalClearGameText.textContent = "ゲームオーバー‥"
     
      
    }
  }
  if (isPlayerAttack) {
    if (
      attackTimer >= 630 &&
      attackTimer <= 700 &&
      positionInPixels >= enemyLeft -hitRangeFront &&
      positionInPixels <= enemyLeft + hitRangeBack-5
    ) {
      
      // ゲームクリアの処理
      mask.classList.remove('deactive');
      gameState.chargeTimer = 0;
      gameState.enemyChargeTimer = 0;
      gameState.gameFinish = true;
      playerData.shotSettings.normal.enable = false;
      modalClearGameText.textContent = "ゲームクリア！！"
      modalClearGame.classList.remove('deactive')
      gameState.stageCount++;
      document.querySelectorAll('.attackLi').forEach(attack => {
        attack.remove();
      });
      
      if (gameState.stageCount === 2) {
        newShot.textContent = 'ビッグショットを覚えました！'
        bigShot.style.display = 'flex'
        enemySpeedShot.style.display = 'flex';
        enemy.style.color = "purple"
        enemyData.chargeSpeed += .1
        enemyData.speed += .2
        
        bigShot.classList.add('deactive');
        
      }
      else if (gameState.stageCount === 3) {
        newShot.textContent = 'カーブショットを覚えました！'
        curveShot.style.display = 'flex'
        enemy.style.color = "silver"
        enemyData.chargeSpeed += .1
        enemyData.speed += .1
        enemyInvincible.style.display = 'flex';
      } 
      else {
        newShot.textContent = ''
      }
      if (gameState.stageCount >= 2) {
        
        shotProcess (
          playerData.shotSettings.big, 
          's', 
          playerData.shotSettings.big.cost, 
          bigShotElement, 
          playerData.shotSettings.big.speed, 
          playerData.shotSettings.big.hitRangeFront, 
          playerData.shotSettings.big.hitRangeBack
        )
      }
      if (gameState.stageCount >= 3) {
        shotProcess (
          playerData.shotSettings.curve, 
          'd', 
          playerData.shotSettings.curve.cost, 
          curveShotElement, 
          playerData.shotSettings.curve.speed, 
          playerData.shotSettings.curve.hitRangeFront, 
          playerData.shotSettings.curve.hitRangeBack,
          true,
        )
      }

      // 三回勝った時の処理
      if (gameState.stageCount === 4) {
        mask.classList.remove('deactive');
        modal.classList.remove('deactive')
        modalClearGame.classList.remove('deactive')    
        modalNextGame.style.display = "none"
        gameState.chargeTimer = 0;
        gameState.enemyChargeTimer = 0;
        gameState.gameFinish = true;
        stopAllTimers()
        playerData.shotSettings.normal.enable = false;
        modalClearGameText.textContent = "ゲームを全てクリアしました！"
      }
      
    }
  }
  
  
}