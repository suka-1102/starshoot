
const playerData = {
  speed: .3,
  chargeSpeed: .2
}

const enemyData = {
  speed: .5,
  chargeSpeed: .2,
  
}

let normalShotSettings = {
  enable: false,
  hitRangeFront: 30,
  hitRangeBack: 30,
  cost: 20,
  speed: 1.8

}

let bigShotSettings = {
  enable: false,
  hitRangeFront: 45,
  hitRangeBack: 60,
  speed: 1.8,
  cost: 30,
}

let curveShotSettings = {
  enable: false,
  hitRangeFront: 30,
  hitRangeBack: 30,
  speed: 1.8,
  cost: 30,
}

let enemyNormalShotSettings = {
  enable: false,
  hitRangeFront: 30,
  hitRangeBack: 30,
  speed:1.8,
  cost: 20,
}
let enemySpeedShotSettings = {
  enable: false,
  speed: 7,
  hitRangeFront: 30,
  hitRangeBack: 30,
  cost: 30,
}


let enemyInvincibleSettings = {
  enable: false,
  cost: 40,
}
let enemyInvincibleFlag =false
const startButton = document.getElementById('modalStartButton');
const mask = document.getElementById('mask');
const modal = document.getElementById('modal');
const modalClearGame = document.getElementById('modalClearGame');
const modalClearGameText = document.getElementById('modalClearGameText');
const newShot = document.getElementById('newShot');
const player = document.getElementById('player')
const enemy = document.getElementById('enemy')
const normalAttackElement = document.getElementById('normalAttackElement')
const enemyNormalShotElement = document.getElementById('enemyNormalShotElement')
const enemySpeedShotElement = document.getElementById('enemySpeedShotElement')
const bigShotElement = document.getElementById('bigShotElement')
const playerAttackGuageValue = document.getElementById('playerAttackGuageValue')
const normalShot = document.getElementById('normalShot')
const enemyNormalShot = document.getElementById('enemyNormalShot')
const enemySpeedShot = document.getElementById('enemySpeedShot')
const enemyInvincible = document.getElementById('enemyInvincible')
const bigShot = document.getElementById('bigShot')
const curveShot = document.getElementById('curveShot')

normalShot.classList.add('deactive');
bigShot.style.display = 'none';
curveShot.style.display = 'none';
enemySpeedShot.style.display = 'none';
enemyInvincible.style.display = 'none';

modalClearGame.classList.add('deactive');

// スタートボタンをクリックした時
startButton.addEventListener('click', () => {
  mask.classList.add('deactive');
  modal.classList.add('deactive')
  characterMove(playerData.speed, enemyData.speed);
  // characterMove(enemyData.speed,enemy)
  chargeGauge();
  enemyChargeGauge()
})
let stageCount = 1;
let invincible = false;
// 次へ進むボタンを押した時
modalNextGame.addEventListener('click', () => {
  mask.classList.add('deactive');
  modalClearGame.classList.add('deactive')
  gameFinish = false;
  invincible = true; 
  normalShotSettings.enable = true;
  setTimeout(() => {
    invincible = false;
  }, 4000);
  
  characterMove(playerData.speed, enemyData.speed);
})

let playerPosition = 50;
let enemyPosition = 50;
// キャラクターが動く関数
function characterMove(playerSpeed, enemySpeed) {
  
  let playerPlus = true;
  let enemyPlus = false;
  let lastTime = performance.now();
  let turnNumber = null;
    
  const enemyTurn = setInterval(() => {
    turnNumber = Math.random() * 100;
    if(turnNumber >= 50) enemyPlus =false;
    if(turnNumber < 50) enemyPlus =true;
  }, 2000)
 

  function move(now) {
    if (gameFinish) return;
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
    const playerLeft = player.offsetLeft;
    const enemyLeft = enemy.offsetLeft;
    
    requestAnimationFrame(move);
  }

  requestAnimationFrame(move);
}

let chargeTimer = 0;

// ゲージを貯める関数
function chargeGauge () {
  
  const chargeGaugeTimer = setInterval(() => {
    if (gameFinish) return; 
    
    if (chargeTimer >= 100) {
      chargeTimer = 99.9;
    }

    chargeTimer+= playerData.chargeSpeed;
    playerAttackGuageValue.style.width = `${chargeTimer}%`
    // normalShotが溜まった時
    if (chargeTimer >= 20) {
      normalShot.classList.remove('deactive');
      normalShotSettings.enable = true;
      
    } 
    if (chargeTimer >= 30) {
      bigShot.classList.remove('deactive');
      bigShotSettings.enable = true;
      curveShot.classList.remove('deactive');
      curveShotSettings.enable = true;
    }
    if (chargeTimer < 20) {
      normalShot.classList.add("deactive");
      normalShotSettings.enable = false;
    }
    if (chargeTimer < 30) {
      bigShot.classList.add("deactive");
      bigShotSettings.enable = false;
      curveShot.classList.add("deactive");
      curveShotSettings.enable = false;
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
  const enemyChargeGaugeTimer = setInterval(() => {
    if (gameFinish) return; 
    
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
      enemyNormalShotSettings.enable = true;

      // 相手の攻撃 
      if (!enemyNormalShotLogged) {
        const enemyNormalShotDecision = setInterval(() => {
          enemyAttackDecisionNormal = Math.random() * 100;
          
          if(enemyAttackDecisionNormal < 50) {
            enemyShotProcess (
              enemyNormalShotSettings,
              enemyNormalShotSettings.cost,
              enemyNormalShotElement,
              enemyNormalShotSettings.speed,
              enemyNormalShotSettings.hitRangeFront,
              enemyNormalShotSettings.hitRangeBack
            )
          }
        }, 1000)
        enemyNormalShotLogged = true;
      }

    } 
    if (stageCount >= 2) {
      if (enemyChargeTimer >= 30) {
        enemySpeedShot.classList.remove('deactive');
        enemySpeedShotSettings.enable = true;
  
        // 相手の攻撃 
        if (!enemySpeedShotLogged) {
          const enemySpeedShotDecision = setInterval(() => {
            enemyAttackDecisionSpeed = Math.random() * 100;
            if(enemyAttackDecisionSpeed < 50) {
              
              enemyShotProcess (
                enemySpeedShotSettings,
                enemySpeedShotSettings.cost,
                enemySpeedShotElement,
                enemySpeedShotSettings.speed,
                enemySpeedShotSettings.hitRangeFront,
                enemySpeedShotSettings.hitRangeBack
              )
            }
          }, 1000)
          enemySpeedShotLogged = true;
        }
  
  
      }
    }
    if (stageCount >= 3) {
      if (!enemyInvincibleLogged) {
        const enemyInvincibleDecision = setInterval(() => {
          if (enemyChargeTimer >= 40) {
            enemyAttackDecisionInvincible = Math.random() * 100;
            if (enemyAttackDecisionInvincible < 50) {
              enemyInvincibleFlag  = true;
              enemyChargeTimer -= 40;
              enemy.style.color = "gold";
              setTimeout(() => {
                enemyInvincibleFlag = false;
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
  normalShotSettings, 
  'a', 
  normalShotSettings.cost, 
  normalAttackElement, 
  normalShotSettings.speed,
  normalShotSettings.hitRangeFront, 
  normalShotSettings.hitRangeBack
)



let gameFinish = false

// 当たり判定の関数
function hitJudgment 
(
  positionFixed,
  isPlayerAttack,
  attackTimer,
  hitRangeFront,
  hitRangeBack
) {
  if (gameFinish) return;
  if (invincible) return
  if (isPlayerAttack && enemyInvincibleFlag) return;
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
      chargeTimer = 0;
      enemyChargeTimer = 0;
      gameFinish = true;
      normalShotSettings.enable = false;
      modalClearGameText.textContent = "ゲームオーバー‥"
      // startButton.textContent = 'やり直す'
      // startButton.style.zIndex = "11"
      // stageCount = 1;
      
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
      gameFinish = true;
      normalShotSettings.enable = false;
      modalClearGameText.textContent = "ゲームクリア！！"
      modalClearGame.classList.remove('deactive')
      stageCount++;
      document.querySelectorAll('.attackLi').forEach(attack => {
        attack.remove();
      });
      
      if (stageCount === 2) {
        newShot.textContent = 'ビッグショットを覚えました！'
        bigShot.style.display = 'flex'
        enemySpeedShot.style.display = 'flex';
        enemy.style.color = "purple"
        enemyData.chargeSpeed += .2
        enemyData.speed += .2
        
        bigShot.classList.add('deactive');
        
      }
      else if (stageCount === 3) {
        newShot.textContent = 'カーブショットを覚えました！'
        curveShot.style.display = 'flex'
        enemy.style.color = "silver"
        enemyData.chargeSpeed += .4
        enemyData.speed += .2
        enemyInvincible.style.display = 'flex';
      } 
      else {
        newShot.textContent = ''
      }
      if (stageCount >= 2) {
        
        shotProcess (
          bigShotSettings, 
          's', 
          bigShotSettings.cost, 
          bigShotElement, 
          bigShotSettings.speed, 
          bigShotSettings.hitRangeFront, 
          bigShotSettings.hitRangeBack
        )
      }
      if (stageCount >= 3) {
        shotProcess (
          curveShotSettings, 
          'd', 
          curveShotSettings.cost, 
          curveShotElement, 
          curveShotSettings.speed, 
          curveShotSettings.hitRangeFront, 
          curveShotSettings.hitRangeBack,
          true,
        )
      }

      // 三回勝った時の処理
      if (stageCount === 4) {
        mask.classList.remove('deactive');
        modal.classList.remove('deactive')
        modalClearGame.classList.remove('deactive')    
        modalNextGame.style.display = "none"
        chargeTimer = 0;
        enemyChargeTimer = 0;
        gameFinish = true;
        normalShotSettings.enable = false;
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
    if (shotStatus.enable) {
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
  if (shotStatus.enable) {
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
      // if (enemyAttackTimer <= 100 && bigShotElement.contains(li)) {
      //   li.parentNode.removeChild(li);
      // }
    }, 15);

    if (enemyChargeTimer < 0) {
      enemyChargeTimer = 0;
    }
    if (enemyChargeTimer < cost) {
      shotStatus.enable = false;
    }
  };  
}



if (stageCount === 1) {
  startButton.textContent = 'ゲームスタート'
}

