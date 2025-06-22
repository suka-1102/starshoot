import { playerData, enemyData } from './js/settings.js';
import * as elements from './js/elements.js';
import { initialize } from './js/initialize.js';
import { gameState, timers } from './js/state.js';


initialize();


// let gameState.gameState.enemyInvincibleFlag =false
let enemyTurnInterval,
    chargeGaugeInterval,
    enemyChargeGaugeInterval,
    enemyNormalShotDecisionInterval,
    enemySpeedShotDecisionInterval,
    enemyInvincibleDecisionInterval;
let moveRequestId;

function stopAllTimers() {
  clearInterval(enemyTurnInterval);
  clearInterval(chargeGaugeInterval);
  clearInterval(enemyChargeGaugeInterval);
  clearInterval(enemyNormalShotDecisionInterval);
  clearInterval(enemySpeedShotDecisionInterval);
  clearInterval(enemyInvincibleDecisionInterval);

  cancelAnimationFrame(moveRequestId);

  enemyNormalShotLogged = false;
  enemySpeedShotLogged = false;
  enemyInvincibleLogged = false;
}

normalShot.classList.add('deactive');
bigShot.style.display = 'none';
curveShot.style.display = 'none';
enemySpeedShot.style.display = 'none';
enemyInvincible.style.display = 'none';

modalClearGame.classList.add('deactive');

// スタートボタンをクリックした時
elements.startButton.addEventListener('click', () => {
  mask.classList.add('deactive');
  modal.classList.add('deactive')
  characterMove(playerData.speed, enemyData.speed);
  // characterMove(enemyData.speed,enemy)
  chargeGauge();
  enemyChargeGauge()
})

// let gameState.invincible = false;
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

  // chargeGauge();
  // enemyChargeGauge()
})

let playerPosition = 50;
let enemyPosition = 50;
// キャラクターが動く関数
function characterMove(playerSpeed, enemySpeed) {
  
  let playerPlus = true;
  let enemyPlus = false;
  let lastTime = performance.now();
  let turnNumber = null;
    
  enemyTurnInterval = setInterval(() => {
    turnNumber = Math.random() * 100;
    if(turnNumber >= 50) enemyPlus =false;
    if(turnNumber < 50) enemyPlus =true;
  }, 2000)
 

  function move(now) {
    if (gameState.gameFinish) return;
    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    let playerDistance = playerSpeed * deltaTime * 60;
    let enemyDistance = enemySpeed * deltaTime * 60;

    document.addEventListener('keydown', (event) => {

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        return; // 処理を中断
      }
      switch (event.key) {
        case 'ArrowRight':
          playerPlus = true;
          break;
        case 'ArrowLeft':
          playerPlus = false;
          break;
      }
    });
    if (playerPlus) {
      playerPosition += playerDistance;
    } else {
      playerPosition -= playerDistance;
    }
    if (playerPosition >= 96) playerPlus = false;
    if (playerPosition <= 4) playerPlus = true;

    // 敵の動き
    if (enemyPlus) {
      enemyPosition += enemyDistance;
    } else {
      enemyPosition -= enemyDistance;
    }
    if (enemyPosition >= 96) enemyPlus = false;
    if (enemyPosition <= 4) enemyPlus = true;


    

    player.style.left = `${playerPosition}%`;
    enemy.style.left = `${enemyPosition}%`;

    requestAnimationFrame(move);
  }

  moveRequestId = requestAnimationFrame(move);
}

let chargeTimer = 0;

// ゲージを貯める関数
function chargeGauge () { 
  chargeGaugeInterval = setInterval(() => {
    if (gameState.gameFinish) return; 
    
    if (chargeTimer >= 100) {
      chargeTimer = 99.9;
    }

    chargeTimer+= playerData.chargeSpeed;
    playerAttackGuageValue.style.width = `${chargeTimer}%`
    // normalShotが溜まった時
    if (chargeTimer >= 20) {
      normalShot.classList.remove('deactive');
      playerData.shotSettings.normal.enable = true;
      
    } 
    if (chargeTimer >= 30) {
      bigShot.classList.remove('deactive');
      playerData.shotSettings.big.enable = true;
      curveShot.classList.remove('deactive');
      playerData.shotSettings.curve.enable = true;
    }
    if (chargeTimer < 20) {
      normalShot.classList.add("deactive");
      playerData.shotSettings.normal.enable = false;
    }
    if (chargeTimer < 30) {
      bigShot.classList.add("deactive");
      playerData.shotSettings.big.enable = false;
      curveShot.classList.add("deactive");
      playerData.shotSettings.curve.enable = false;
    }
  }, 15);
}

// 敵のゲージ
let enemyChargeTimer = 0;
let enemyAttackDecisionNormal = 0
let enemyAttackDecisionSpeed = 0


let enemyNormalShotLogged = false;
let enemySpeedShotLogged = false;
let enemyInvincibleLogged = false;
function enemyChargeGauge () {
  enemyChargeGaugeInterval = setInterval(() => {
    if (gameState.gameFinish) return; 
    
    if (enemyChargeTimer >= 100) {
      enemyChargeTimer = 99.9;
    }
    if (enemyChargeTimer <= 0) {
      enemyChargeTimer = 0;
    }

    enemyChargeTimer+= 0.3;
    enemyAttackGuageValue.style.width = `${enemyChargeTimer}%`
    // normalShotが溜まった時
    if (enemyChargeTimer >= 20) {
      enemyNormalShot.classList.remove('deactive');
      enemyData.shotSettings.normal.enable = true;

      // 相手の攻撃 
      if (!enemyNormalShotLogged) {
        enemyNormalShotDecisionInterval = setInterval(() => {
          enemyAttackDecisionNormal = Math.random() * 100;
          
          if(enemyAttackDecisionNormal < 50) {
            enemyShotProcess (
              enemyData.shotSettings.normal,
              enemyData.shotSettings.normal.cost,
              enemyNormalShotElement,
              enemyData.shotSettings.normal.speed,
              enemyData.shotSettings.normal.hitRangeFront,
              enemyData.shotSettings.normal.hitRangeBack
            )
          }
        }, 1000)
        enemyNormalShotLogged = true;
      }

    } 
    if (gameState.stageCount >= 2) {
      if (enemyChargeTimer >= 30) {
        enemySpeedShot.classList.remove('deactive');
        enemyData.shotSettings.speed.enable = true;
  
        // 相手の攻撃 
        if (!enemySpeedShotLogged) {
          enemySpeedShotDecisionInterval = setInterval(() => {
            enemyAttackDecisionSpeed = Math.random() * 100;
            if(enemyAttackDecisionSpeed < 50) {
              
              enemyShotProcess (
                enemyData.shotSettings.speed,
                enemyData.shotSettings.speed.cost,
                enemySpeedShotElement,
                enemyData.shotSettings.speed.speed,
                enemyData.shotSettings.speed.hitRangeFront,
                enemyData.shotSettings.speed.hitRangeBack
              )
            }
          }, 1000)
          enemySpeedShotLogged = true;
        }
  
  
      }
    }
    if (gameState.stageCount >= 3) {
      if (!enemyInvincibleLogged) {
        enemyInvincibleDecisionInterval = setInterval(() => {
          if (enemyChargeTimer >= 40) {
            enemyAttackDecisionInvincible = Math.random() * 100;
            if (enemyAttackDecisionInvincible < 50) {
              gameState.enemyInvincibleFlag  = true;
              enemyChargeTimer -= 40;
              enemy.style.color = "gold";
              setTimeout(() => {
                gameState.enemyInvincibleFlag = false;
                enemy.style.color = "silver";
              }, 3000);
            }
          }
        }, 1000);
        enemyInvincibleLogged = true;
      }
      
    }
    
    if (enemyChargeTimer < 20) {
      enemyNormalShot.classList.add("deactive");
      // normalShotSettings.enable = false;
    }
    if (enemyChargeTimer < 30) {
      enemySpeedShot.classList.add("deactive");
    }
    if (enemyChargeTimer < 40) {
      enemyInvincible.classList.add("deactive")
    }
  }, 15);
}

const playerLeft = player.offsetLeft;

shotProcess (
  playerData.shotSettings.normal, 
  'a', 
  playerData.shotSettings.normal.cost, 
  normalAttackElement, 
  playerData.shotSettings.normal.speed,
  playerData.shotSettings.normal.hitRangeFront, 
  playerData.shotSettings.normal.hitRangeBack
)



// let gameState.gameFinish = false

// 当たり判定の関数
function hitJudgment 
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
      chargeTimer = 0;
      enemyChargeTimer = 0;
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
      chargeTimer = 0;
      enemyChargeTimer = 0;
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
        chargeTimer = 0;
        enemyChargeTimer = 0;
        gameState.gameFinish = true;
        stopAllTimers()
        playerData.shotSettings.normal.enable = false;
        modalClearGameText.textContent = "ゲームを全てクリアしました！"
      }
      
    }
  }
  
  
}

function shotProcess 
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
     

        let playerPositionFixed = playerPosition 
        let curveProcessNumber = 0;
        let curvePlus = true;
        const playerPositionMemo = playerPositionFixed
        chargeTimer -= cost;

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
            if (gameState.gameFinish) {
              clearInterval(curveShotProcess)
            }
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

        if (enemyChargeTimer < 0) {
          enemyChargeTimer = 0;
        }
        if (enemyChargeTimer < cost) {
          shotStatus.enable = false;
        }
      }
    }
  });  
}

// 敵の玉の処理
function enemyShotProcess (shotStatus, cost, enemyShotElement, speed, hitRangeFront, hitRangeBack) {
  let attackCount = 0;
  if (shotStatus.enable && !gameState.gameFinish) {
    const enemyPositionFixed = enemyPosition;
    enemyChargeTimer -= cost;

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

    if (enemyChargeTimer < 0) {
      enemyChargeTimer = 0;
    }
    if (enemyChargeTimer < cost) {
      shotStatus.enable = false;
    }
  };  
}



if (gameState.stageCount === 1) {
  elements.startButton.textContent = 'ゲームスタート'
}

