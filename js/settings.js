
export const playerData = {
  speed: .3,
  chargeSpeed: .2,
  shotSettings: {
    normal: {
      enable: false,
      hitRangeFront: 30,
      hitRangeBack: 30,
      cost: 20,
      speed: 1.8
    },
    big: {
      enable: false,
      hitRangeFront: 45,
      hitRangeBack: 60,
      speed: 1.8,
      cost: 30,
    },
    curve: {
      enable: false,
      hitRangeFront: 30,
      hitRangeBack: 30,
      speed: 1.8,
      cost: 30,
    }
  }
}

export const enemyData = {
  speed: .5,
  chargeSpeed: .2,
  shotSettings: {
    normal: {
      enable: false,
      hitRangeFront: 30,
      hitRangeBack: 30,
      cost: 20,
      speed: 1.8
    },
    speed: {
      enable: false,
      speed: 7,
      hitRangeFront: 30,
      hitRangeBack: 30,
      cost: 30
    },
    invincible: {
      enable: false,
      cost: 40,
    }

  }
  
}