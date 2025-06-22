import { timers } from './state.js';

let enemyNormalShotLogged = false;
let enemySpeedShotLogged = false;
let enemyInvincibleLogged = false;
export function stopAllTimers() {
  clearInterval(timers.enemyTurnInterval);
  clearInterval(timers.chargeGaugeInterval);
  clearInterval(timers.enemyChargeGaugeInterval);
  clearInterval(timers.enemyNormalShotDecisionInterval);
  clearInterval(timers.enemySpeedShotDecisionInterval);
  clearInterval(timers.enemyInvincibleDecisionInterval);

  cancelAnimationFrame(timers.moveRequestId);

  enemyNormalShotLogged = false;
  enemySpeedShotLogged = false;
  enemyInvincibleLogged = false;
}