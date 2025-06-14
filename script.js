
const playerData = {
  attackSize: 10,
  normalAttackSpeed: 1.3,
  speed: .3
}

const enemyData = {
  attackSize: 10,
  attackSpeed: 5,
  speed: .3,
}



const startButton = document.getElementById('modalStartButton');
const mask = document.getElementById('mask');
const modal = document.getElementById('modal');
const modalClearGame = document.getElementById('modalClearGame');
const player = document.getElementById('player')
const enemy = document.getElementById('enemy')
const normalAttackElement = document.getElementById('normalAttackElement')
const playerAttackGuageValue = document.getElementById('playerAttackGuageValue')
const normalShot = document.getElementById('normalShot')

normalShot.classList.add('deactive');

modalClearGame.classList.add('deactive');
// スタートボタンをクリックした時
startButton.addEventListener('click', () => {
  mask.classList.add('deactive');
  modal.classList.add('deactive')
  characterMove(playerData.speed,player);
  // characterMove(enemyData.speed,enemy)
  chargeGauge();
})

// 次へ進むボタンを押した時
modalNextGame.addEventListener('click', () => {
  mask.classList.add('deactive');
  modalClearGame.classList.add('deactive')
  gameFinish = false;
  normalShotEnable = true;
  characterMove(playerData.speed,player);
})

let position = 50;
// キャラクターが動く関数
function characterMove(characterSpeed, characterName) {
  
  let plus = true;
  let lastTime = performance.now();

  function move(now) {
    if (gameFinish) return; 
    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    let distance = characterSpeed * deltaTime * 60;

    document.addEventListener('keydown', (event) => {

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        return; // 処理を中断
      }
      switch (event.key) {
        case 'ArrowRight':
          plus = true;
          break;
        case 'ArrowLeft':
          plus = false;
          break;
      }
    });
    if (plus) {
      position += distance;
    } else {
      position -= distance;
    }

    if (position >= 95) plus = false;
    if (position <= 5) plus = true;

    characterName.style.left = `${position}%`;
    const playerLeft = player.offsetLeft;
    const enemyLeft = enemy.offsetLeft;
    
    requestAnimationFrame(move);
  }

  requestAnimationFrame(move);
}
normalShotButton();

let chargeTimer = 0;
let normalShotEnable = false
// ゲージを貯める関数
function chargeGauge () {
  
  const chargeGaugeTimer = setInterval(() => {
    if (gameFinish) return; 
    
    if (chargeTimer >= 100) {
      chargeTimer = 99.9;
    }

    chargeTimer+= 0.1;
    playerAttackGuageValue.style.width = `${chargeTimer}%`
    // normalShotが溜まった時
    if (chargeTimer >= 20) {
      normalShot.classList.remove('deactive');
      normalShotEnable = true;
      
    } else {
      normalShot.classList.add("deactive")
    }
  }, 15);
}


const playerLeft = player.offsetLeft;

// normalShotの関数
function normalShotButton () {
  let attackCount = 0;
  document.addEventListener('keydown', (event) => {
    if (normalShotEnable) {
      if (event.key === 'a') {
        const positionFixed = position
        chargeTimer -= 20;

        const li = document.createElement('li');
        li.classList.add('normalAttackLi')
        li.id = `normalAttackLi${attackCount}`;
        
        normalAttackElement.appendChild(li);

        attackCount++;
        // 玉が飛んでいく処理
        let normalAttackTimer = 150;
        const normalAttack = setInterval(() => {
          
          normalAttackTimer+= playerData.normalAttackSpeed;
          li.style.bottom = `${normalAttackTimer}px`
          li.style.left = `${positionFixed}%`;

          hitJudgment(positionFixed,normalAttackTimer)
          if (normalAttackTimer >= 720 && normalAttackElement.contains(li)) {
            li.parentNode.removeChild(li);
          }
        }, 15);

        if (chargeTimer < 0) {
          chargeTimer = 0;
        }
        if (chargeTimer < 20) {
          normalShotEnable = false;
        }
      }
    }
  });
}

let gameFinish = false
// 当たり判定の関数
function hitJudgment (positionFixed,normalAttackTimer) {
  const enemyLeft = enemy.offsetLeft;
  const positionInPixels = 600 * (positionFixed / 100);
  if (
    normalAttackTimer >= 630 &&
    normalAttackTimer <= 710 &&
    positionInPixels >= enemyLeft -30 &&
    positionInPixels <= enemyLeft + 30
  ) {
    
    // ゲームクリアの処理
    mask.classList.remove('deactive');
    chargeTimer = 0;
    gameFinish = true;
    normalShotEnable = false;
    modalClearGame.classList.remove('deactive')
    
  }

}