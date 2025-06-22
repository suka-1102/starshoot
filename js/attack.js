import { gameState } from './state.js';
import { hitJudgment } from './hit.js';

export function shotProcess 
(shotStatus,
  button, 
  cost, 
  shotElement, 
  speed, 
  hitRangeFront, 
  hitRangeBack,
  isCurveShot
) {
  let attackCount = 0;

  document.addEventListener('keydown', (event) => {
    if (shotStatus.enable && !gameState.gameFinish) {
      if (event.key === `${button}`) {
     

        let playerPositionFixed = gameState.playerPosition 
        let curveProcessNumber = 0;
        let curvePlus = true;
        const playerPositionMemo = playerPositionFixed
        gameState.chargeTimer -= cost;

        if (isCurveShot) {
          const curveShotProcess = setInterval(() => {
          
            if (curveProcessNumber >= 20) curvePlus = false;
            if (curveProcessNumber <= -20) curvePlus = true;
            if (curvePlus) {
              curveProcessNumber += .4;
              playerPositionFixed = playerPositionMemo + curveProcessNumber;
            } else {
              curveProcessNumber -= .4;
              playerPositionFixed = playerPositionMemo + curveProcessNumber;
            }
            // if (gameState.gameFinish) {
            //   clearInterval(curveShotProcess)
            // }
          },10)
        }
        
        const li = document.createElement('li');
        li.classList.add('attackLi')
        li.id = `attackLi${attackCount}`;
        
        shotElement.appendChild(li);

        attackCount++;
        // 玉が飛んでいく処理
        let attackTimer = 150;
        const normalAttack = setInterval(() => {
          
          attackTimer+= speed;
          li.style.bottom = `${attackTimer}px`
          li.style.left = `${playerPositionFixed}%`;

          hitJudgment
          (
            playerPositionFixed,
            true,
            attackTimer,
            hitRangeFront, 
            hitRangeBack
          )
          if (attackTimer >= 720 && normalAttackElement.contains(li)) {
            li.parentNode.removeChild(li);
          }
          if (attackTimer >= 720 && bigShotElement.contains(li)) {
            li.parentNode.removeChild(li);
          }
          if (gameState.gameFinish) {
            clearInterval(normalAttack)
          }
        }, 15);

        if (gameState.enemyChargeTimer < 0) {
          gameState.enemyChargeTimer = 0;
        }
        if (gameState.enemyChargeTimer < cost) {
          shotStatus.enable = false;
        }
      }
    }
  });  
}

export function enemyShotProcess 
(shotStatus, cost, enemyShotElement, speed, hitRangeFront, hitRangeBack) 
{
  let attackCount = 0;
  if (shotStatus.enable && !gameState.gameFinish) {
    const enemyPositionFixed = gameState.enemyPosition;
    gameState.enemyChargeTimer -= cost;

    const li = document.createElement('li');
    li.classList.add('attackLi');
    li.id = `attackLi${attackCount}`;
    
    enemyShotElement.appendChild(li);

    attackCount++;
    // 玉が飛んでいく処理
    let enemyAttackTimer = 650;
    const normalAttack = setInterval(() => {
      
      enemyAttackTimer -= speed;
      li.style.bottom = `${enemyAttackTimer}px`
      li.style.left = `${enemyPositionFixed}%`;
      
      
      hitJudgment
      (
        enemyPositionFixed,
        false,
        enemyAttackTimer,
        hitRangeFront, 
        hitRangeBack
      )
      if (enemyAttackTimer <= 50 && enemyNormalShotElement.contains(li)) {
        li.parentNode.removeChild(li);
      }
    }, 15);

    if (gameState.enemyChargeTimer < 0) {
      gameState.enemyChargeTimer = 0;
    }
    if (gameState.enemyChargeTimer < cost) {
      shotStatus.enable = false;
    }
  };  
}