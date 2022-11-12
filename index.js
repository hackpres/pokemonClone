const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70));
}
const boundaries = [];
const offset = {
    x: -255,
    y: -470
}
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1027) {
            boundaries.push(
                new Boundary({
                    width: 48,
                    height: 48,
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y,
                    }
                })
            )
        } else if (symbol === 1030) {
            boundaries.push(
                new Boundary({
                    width: 48,
                    height: 24,
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y - Boundary.height / 100,
                    }
                })
            )
        } else if (symbol === 1029) {
            boundaries.push(
                new Boundary({
                    width: 24,
                    height: 24,
                    position: {
                        x: j * Boundary.width + offset.x + Boundary.width / 100,
                        y: i * Boundary.height + offset.y - Boundary.height / 100,
                    }
                })
            )
        } else if (symbol === 1028) {
            boundaries.push(
                new Boundary({
                    width: 24,
                    height: 24,
                    position: {
                        x: j * Boundary.width + offset.x + Boundary.width / 2,
                        y: i * Boundary.height + offset.y - Boundary.height / 100,
                    }
                })
            )
        }
    })
})

const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
    battleZonesMap.push(battleZonesData.slice(i, i + 70));
}
const battleZones = [];
battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1026)
            battleZones.push(
                new Boundary({
                    width: 48,
                    height: 48,
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
    })
})
const map = new Image();
map.src = './img/pokemonGameMap.png';
const foregroundMap = new Image();
foregroundMap.src = './img/foreground.png';

const playerUpImg = new Image();
playerUpImg.src = './img/sprites/chars/kemina/keminaUp.png';
const playerDownImg = new Image();
playerDownImg.src = './img/sprites/chars/kemina/keminaDown.png';
const playerLeftImg = new Image();
playerLeftImg.src = './img/sprites/chars/kemina/keminaLeft.png';
const playerRightImg = new Image();
playerRightImg.src = './img/sprites/chars/kemina/keminaRight.png';


const Player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 69 / 2,
    },
    image: playerDownImg,
    frames: {
        max: 4,
        hold: 10,
    },
    sprites: {
        up: playerUpImg,
        down: playerDownImg,
        left: playerLeftImg,
        right: playerRightImg
    }
})
const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y,
    },
    image: map
})
const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y,
    },
    image: foregroundMap
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
}

const battle = {
    initiated: false,
}

const movables = [background, ...boundaries, foreground, ...battleZones];
const rectCollision = ({ rect1, rect2 }) => {
    return (
        rect1.position.x + rect1.width >= rect2.position.x &&
        rect1.position.x <= rect2.position.x + rect2.width &&
        rect1.position.y <= rect2.position.y + rect2.height &&
        rect1.position.y + rect1.height >= rect2.position.y
    )
};
const animate = () => {
    const animationID = window.requestAnimationFrame(animate);
    background.draw();
    boundaries.forEach(boundary => {
        boundary.draw();
    })
    battleZones.forEach(battleZone => {
        battleZone.draw()
    })
    Player.draw();
    foreground.draw();

    let moving = true;
    Player.animate = false;
    if(battle.initiated) return;
    // activates a battle
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i];
            const overlappingArea =
                (Math.min(
                    Player.position.x + Player.width,
                    battleZone.position.x + battleZone.width
                ) - Math.max(
                    Player.position.x,
                    battleZone.position.x
                )) * (Math.min(
                    Player.position.y + Player.height,
                    battleZone.position.y + battleZone.height
                ) - Math.max(
                    Player.position.y,
                    battleZone.position.y
                ))
            if (rectCollision({
                rect1: Player,
                rect2: battleZone
            }) &&
                overlappingArea > (Player.width * Player.height) / 2
                && Math.random() < 0.01
            ) {
                //  deactivate current animation frame
                window.cancelAnimationFrame(animationID);
                battle.initiated = true;
                gsap.to('#blackFlash', {
                    yoyo: true,
                    opacity: 1,
                    repeat: 3,
                    duration: 0.2,
                    onComplete() {
                        gsap.to('#blackFlash', { 
                            opacity: 1,
                            duration: .4,
                            onComplete() {
                                //  activae new animation loop
                                initBattle();
                                animateBattle();
                                gsap.to('#blackFlash', { 
                                    opacity: 0,
                                    duration: .4,
                                });
                                gsap.to('#enemyInterface', { 
                                    opacity: 1,
                                    duration: .4,
                                });
                                gsap.to('#playerInterface', { 
                                    opacity: 1,
                                    duration: .4,
                                });
                                gsap.to('#battleInterface', { 
                                    opacity: 1,
                                    duration: .4,
                                });
                            }
                        });
                    }
                });
                break
            }
        }
    }
    if (keys.w.pressed && lastKey === 'w') {
        Player.animate = true;
        Player.image = Player.sprites.up;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectCollision({
                rect1: Player,
                rect2: {
                    ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }
                }
            })) {
                moving = false;
                break
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.y += 3
            })
        }
    } else if (keys.s.pressed && lastKey === 's') {
        Player.animate = true;
        Player.image = Player.sprites.down;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectCollision({
                rect1: Player,
                rect2: {
                    ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3
                    }
                }
            })) {
                moving = false;
                break
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.y -= 3
            })
        }
    } else if (keys.a.pressed && lastKey === 'a') {
        Player.animate = true;
        Player.image = Player.sprites.left;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectCollision({
                rect1: Player,
                rect2: {
                    ...boundary, position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y
                    }
                }
            })) {
                moving = false;
                break
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.x += 3
            })
        }
    } else if (keys.d.pressed && lastKey === 'd') {
        Player.animate = true;
        Player.image = Player.sprites.right;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectCollision({
                rect1: Player,
                rect2: {
                    ...boundary, position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y
                    }
                }
            })) {
                moving = false;
                break
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.x -= 3
            })
        }
    };
};
animate();



let lastKey = '';
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break;
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break;
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break;
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break;
    }
});
window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false
            break;
        case 'a':
            keys.a.pressed = false
            break;
        case 's':
            keys.s.pressed = false
            break;
        case 'd':
            keys.d.pressed = false
            break;
    }
});