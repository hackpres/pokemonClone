const acerbImg = new Image();
acerbImg.src = './img/sprites/monsters/small/acerb.png';
const eeekaImg = new Image();
eeekaImg.src = './img/sprites/monsters/small/eeeka.png';
const stransImg = new Image();
stransImg.src = './img/sprites/monsters/small/strans.png';

const monsters = {
    small: {
        Acerb: {
            position: {
                x: 750,
                y: 65,
            },
            image: {
                src: './img/sprites/monsters/small/acerb.png'
            },
            frames: {
                max: 4,
                hold: 15,
            },
            animate: true,
            isEnemy: true,
            name: 'Acerb',
            attacks: [attacks.Tackle, attacks.Fireball],
        },
        Eeeka: {
            position: {
                x: 750,
                y: 65,
            },
            image: {
                src: './img/sprites/monsters/small/eeeka.png'
            },
            frames: {
                max: 4,
                hold: 15,
            },
            animate: true,
            isEnemy: true,
            name: 'Eeeka',
            attacks: [attacks.Tackle],
        },
        Strans: {
            position: {
                x: 750,
                y: 65,
            },
            image: {
                src: './img/sprites/monsters/small/strans.png'
            },
            frames: {
                max: 4,
                hold: 15,
            },
            animate: true,
            isEnemy: true,
            name: 'Strans',
            attacks: [attacks.Tackle],
        }
    },
    medium: {

    },
    large: {

    }
}