
const playerData = {
  attackSize: 10,
  normalAttackSpeed: 1.3,
  bigShotSpeed: 1.3,
  speed: .3,
  normalShotCost: 20,
  bigShotCost: 30,
}

const enemyData = {
  attackSize: 10,
  attackSpeed: 5,
  speed: .5,
}

let normalShotSettings = {
  enable: false,
  hitRangeFront: 30,
  hitRangeBack: 30,

}

let bigShotSettings = {
  enable: false,
  hitRangeFront: 45,
  hitRangeBack: 60,
}

const startButton = document.getElementById('modalStartButton');
const mask = document.getElementById('mask');
const modal = document.getElementById('modal');
const modalClearGame = document.getElementById('modalClearGame');
const newShot = document.getElementById('newShot');
const player = document.getElementById('player')
const enemy = document.getElementById('enemy')
const normalAttackElement = document.getElementById('normalAttackElement')
const bigShotElement = document.getElementById('bigShotElement')
const playerAttackGuageValue = document.getElementById('playerAttackGuageValue')
const normalShot = document.getElementById('normalShot')
const bigShot = document.getElementById('bigShot')

normalShot.classList.add('deactive');
bigShot.style.display = 'none';

modalClearGame.classList.add('deactive');
// スタートボタンをクリックした時
startButton.addEventListener('click', () => {
  mask.classList.add('deactive');
  modal.classList.add('deactive')
  
  characterMove(playerData.speed, enemyData.speed);
  // characterMove(enemyData.speed,enemy)
  chargeGauge();
})
let stageCount = 1;
// 次へ進むボタンを押した時
modalNextGame.addEventListener('click', () => {
  mask.classList.add('deactive');
  modalClearGame.classList.add('deactive')
  gameFinish = false;
  normalShotSettings.enable = true;
  
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
normalShotButton();

let chargeTimer = 0;

// ゲージを貯める関数
function chargeGauge () {
  
  const chargeGaugeTimer = setInterval(() => {
    if (gameFinish) return; 
    
    if (chargeTimer >= 100) {
      chargeTimer = 99.9;
    }

    chargeTimer+= 0.3;
    playerAttackGuageValue.style.width = `${chargeTimer}%`
    // normalShotが溜まった時
    if (chargeTimer >= 20) {
      normalShot.classList.remove('deactive');
      normalShotSettings.enable = true;
      
    } 
    if (chargeTimer >= 30) {
      bigShot.classList.remove('deactive');
      bigShotSettings.enable = true;
    }
    if (chargeTimer < 20) {
      normalShot.classList.add("deactive");
      normalShotSettings.enable = false;
    }
    if (chargeTimer < 30) {
      bigShot.classList.add("deactive");
      bigShotSettings.enable = false;
    }
  }, 15);
}


const playerLeft = player.offsetLeft;

// normalShotの関数
function normalShotButton () {
  shotProcess (normalShotSettings, 'a', playerData.normalShotCost, normalAttackElement, playerData.normalAttackSpeed,normalShotSettings.hitRangeFront, normalShotSettings.hitRangeBack)
  shotProcess (bigShotSettings, 's', playerData.bigShotCost, bigShotElement, playerData.bigShotSpeed, bigShotSettings.hitRangeFront, bigShotSettings.hitRangeBack)
  
}

let gameFinish = false

// 当たり判定の関数
function hitJudgment (positionFixed, attackTimer, hitRangeFront, hitRangeBack) {
  if (gameFinish) return;
  const enemyLeft = enemy.offsetLeft;
  const positionInPixels = 600 * (positionFixed / 100);
  if (
    attackTimer >= 630 &&
    attackTimer <= 710 &&
    positionInPixels >= enemyLeft -hitRangeFront &&
    positionInPixels <= enemyLeft + hitRangeBack-5
  ) {
    
    // ゲームクリアの処理
    mask.classList.remove('deactive');
    chargeTimer = 0;
    gameFinish = true;
    normalShotSettings.enable = false;
    modalClearGame.classList.remove('deactive')
    
    stageCount++;
    if (stageCount === 2) {
      newShot.textContent = 'ビッグショットを覚えました！'
      bigShot.style.display = 'flex'
   
      bigShot.classList.add('deactive');
      
      
      
      


    }
    else if (stageCount === 3) {
      newShot.textContent = 'fwiorjfを覚えました！'
    } else {
      newShot.textContent = ''
    }

  
   
    


  }
  
}


function shotProcess (shotStatus,button, cost, shotElement, speed, hitRangeFront, hitRangeBack) {
  let attackCount = 0;
  document.addEventListener('keydown', (event) => {
    if (shotStatus.enable) {
      if (event.key === `${button}`) {
        const positionFixed = playerPosition
        chargeTimer -= cost;

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
          li.style.left = `${positionFixed}%`;

          hitJudgment(positionFixed,attackTimer,hitRangeFront, hitRangeBack)
          if (attackTimer >= 720 && normalAttackElement.contains(li)) {
            li.parentNode.removeChild(li);
          }
          if (attackTimer >= 720 && bigShotElement.contains(li)) {
            li.parentNode.removeChild(li);
          }
        }, 15);

        if (chargeTimer < 0) {
          chargeTimer = 0;
        }
        if (chargeTimer < cost) {
          shotStatus.enable = false;
        }
      }
    }
  });  
}



