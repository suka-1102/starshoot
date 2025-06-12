
const playerData = {
  attackSize: 10,
  attackSpeed: 5,
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
const player = document.getElementById('player')
const enemy = document.getElementById('enemy')
const playerAttack = document.getElementById('playerAttack')
const playerAttackGuageValue = document.getElementById('playerAttackGuageValue')
const normalShot = document.getElementById('normalShot')

normalShot.classList.add('deactive');


// スタートボタンをクリックした時
startButton.addEventListener('click', () => {
  mask.classList.add('deactive');
  modal.classList.add('deactive')
  characterMove(playerData.speed,player);
  // characterMove(enemyData.speed,enemy)
  chargeGauge();
})

// キャラクターが動く関数
function characterMove(characterSpeed, characterName) {
  let position = 50;
  let plus = true;
  let lastTime = performance.now();

  function move(now) {
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
    requestAnimationFrame(move);
  }

  requestAnimationFrame(move);
}


let chargetimer = 0;
let normalShotEnable = false
// ゲージを貯める関数
function chargeGauge () {
  
  const chargeGaugeTimer = setInterval(() => {
    
    if (chargetimer >= 100) {
      chargetimer = 99.9;
    }

    chargetimer+= 0.1;
    var set = chargetimer;
    playerAttackGuageValue.style.width = `${chargetimer}%`
    // normalShotが溜まった時
    if (chargetimer >= 20) {
      normalShot.classList.remove('deactive');
      normalShotEnable = true;
      
    } else {
      normalShot.classList.add("deactive")
    }
  }, 15);
}


// normalShotの関数
function normalShotButton () {
  document.addEventListener('keydown', (event) => {
    if (normalShotEnable) {
      if (event.key === 'a') {
        chargetimer -= 20;
        if (chargetimer < 0) {
          chargetimer = 0;
        }
        if (chargetimer < 20) {
          normalShotEnable = false;
        }
      }
    }
  });
}

normalShotButton();

