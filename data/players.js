const cordellBattleImg = new Image();
cordellBattleImg.src = './img/sprites/chars/cordell/cordellBattle.png'
const keminaBattleImg = new Image();
keminaBattleImg.src = './img/sprites/chars/kemina/keminaBattle.png'

const players = {
    Cordell: {
        position: {
            x: 205,
            y: 150,
        },
        image: {
            src: './img/sprites/chars/cordell/cordellBattle.png'
        },
        frames: {
            max: 4,
            hold: 30,
        },
        animate: true,
        name: 'Cordell',
        attacks: [attacks.Tackle, attacks.Fireball, attacks.Fireball, attacks.Tackle]
    },
    Kemina: {
        position: {
            x: 205,
            y: 150,
        },
        image: {
            src: './img/sprites/chars/kemina/keminaBattle.png'
        },
        frames: {
            max: 4,
            hold: 30,
        },
        animate: true,
        name: 'Kemina',
        attacks: [attacks.Tackle, attacks.Fireball, attacks.Fireball, attacks.Tackle]
    }
}