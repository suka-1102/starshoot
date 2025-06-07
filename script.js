
const playerData = {
  attackSize: 10,
  attackSpeed: 5,
  speed: .15
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
// スタートボタンをクリックした時
startButton.addEventListener('click', () => {
  mask.classList.add('deactive');
  modal.classList.add('deactive')
  characterMove(playerData.speed,player);
  // characterMove(enemyData.speed,enemy)
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

