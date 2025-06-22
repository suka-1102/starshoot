
export const gameState = {
  gameFinish: false,
  stageCount: 1,
  invincible: false,
  enemyInvincibleFlag: false,
  playerPosition: 50,
  enemyPosition: 50,
  chargeTimer: 0,
  enemyChargeTimer: 0,
};

export const timers = {
  enemyTurnInterval: null,
  chargeGaugeInterval: null,
  enemyChargeGaugeInterval: null,
  enemyNormalShotDecisionInterval: null,
  enemySpeedShotDecisionInterval: null,
  enemyInvincibleDecisionInterval: null,
  moveRequestId: null,
};