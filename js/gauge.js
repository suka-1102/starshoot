import { playerData, enemyData } from './settings.js';
import { gameState, timers } from './state.js';

import { enemyShotProcess } from './attack.js';

const playerAttackGuageValue = document.getElementById("playerAttackGuageValue")
const normalShot = document.getElementById("normalShot")
const bigShot = document.getElementById("bigShot")
const curveShot = document.getElementById("curveShot")

export function chargeGauge() {
  gameState.chargeGaugeInterval = setInterval(() => {
    if (gameState.gameFinish) return;

    gameState.chargeTimer += playerData.chargeSpeed;
    if (gameState.chargeTimer >= 100) gameState.chargeTimer = 99.9;

    playerAttackGuageValue.style.width = `${gameState.chargeTimer}%`;

    const enableNormal = gameState.chargeTimer >= 20;
    const enableBig = gameState.chargeTimer >= 30;

    playerData.shotSettings.normal.enable = enableNormal;
    playerData.shotSettings.big.enable = enableBig;
    playerData.shotSettings.curve.enable = enableBig;

    normalShot.classList.toggle('deactive', !enableNormal);
    bigShot.classList.toggle('deactive', !enableBig);
    curveShot.classList.toggle('deactive', !enableBig);

  }, 15);
}

let enemyNormalShotLogged = false;
let enemySpeedShotLogged = false;
let enemyInvincibleLogged = false;

let enemyAttackDecisionNormal = 0
let enemyAttackDecisionSpeed = 0
let enemyAttackDecisionInvincible = 0

export function enemyChargeGauge () {
  timers.enemyChargeGaugeInterval = setInterval(() => {
    if (gameState.gameFinish) return; 
    
    if (gameState.enemyChargeTimer >= 100) {
      gameState.enemyChargeTimer = 99.9;
    }
    if (gameState.enemyChargeTimer <= 0) {
      gameState.enemyChargeTimer = 0;
    }

    gameState.enemyChargeTimer+= 0.3;
    enemyAttackGuageValue.style.width = `${gameState.enemyChargeTimer}%`
    // normalShotが溜まった時
    if (gameState.enemyChargeTimer >= 20) {
      enemyNormalShot.classList.remove('deactive');
      enemyData.shotSettings.normal.enable = true;

      // 相手の攻撃 
      if (!enemyNormalShotLogged) {
        timers.enemyNormalShotDecisionInterval = setInterval(() => {
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
      if (gameState.enemyChargeTimer >= 30) {
        enemySpeedShot.classList.remove('deactive');
        enemyData.shotSettings.speed.enable = true;
  
        // 相手の攻撃 
        if (!enemySpeedShotLogged) {
          timers.enemySpeedShotDecisionInterval = setInterval(() => {
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
        timers.enemyInvincibleDecisionInterval = setInterval(() => {
          if (gameState.enemyChargeTimer >= 40) {
            enemyAttackDecisionInvincible = Math.random() * 100;
            if (enemyAttackDecisionInvincible < 50) {
              gameState.enemyInvincibleFlag  = true;
              gameState.enemyChargeTimer -= 40;
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
    
    if (gameState.enemyChargeTimer < 20) {
      enemyNormalShot.classList.add("deactive");
      // normalShotSettings.enable = false;
    }
    if (gameState.enemyChargeTimer < 30) {
      enemySpeedShot.classList.add("deactive");
    }
    if (gameState.enemyChargeTimer < 40) {
      enemyInvincible.classList.add("deactive")
    }
  }, 15);
}