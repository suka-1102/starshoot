
playerData = {
  attackSize: 10,
  attackSpeed: 5,
  speed: .1
}

enemyData = {
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
  characterMove(playerData.speed,player)
  characterMove(enemyData.speed,enemy)
})

// キャラクターが動く関数
function characterMove(characterSpeed,characterName) {
  let position = 50;
  let plus = true;

  function move() {
    if (plus) {
      position += characterSpeed;
    } else {
      position -= characterSpeed;
    }
    if (position >= 95) {
      plus = false;
    }
    if (position <= 5) {
      plus = true;
    }
    characterName.style.left = `${position}%`;
    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);
}

