
playerData = {
  attackSize: 10,
  attackSpeed: 5,
  characterSpeed: 5
}

enemyData = {
  attackSize: 10,
  attackSpeed: 5,
  characterSpeed: 5
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
})

// キャラクターが動く関数
function characterMove() {
  let position = 50;
  const plus = true;
  function move() {
    if (plus) {
      position += 0.1;
      if (position >= 100) {
        position = 100;
        plus = false;
        console.log(plus)
      } 
    }
    else {
      position -= 0.1;
      if (position <= 0) {
        position = 0;
        plus = true;
      }
    }
    player.style.left = `${position}%`;
    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);
}
characterMove()