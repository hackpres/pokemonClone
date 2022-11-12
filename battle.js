const battleBackgroundImg = new Image();
battleBackgroundImg.src = './img/battleBackground.png';
const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    image: battleBackgroundImg
});

let enemy
let playerBattle
let renderedSprites
let battleAnimationId
let queue

const initBattle = () => {
    document.querySelector('#playerInterface').style.display = 'block';
    document.querySelector('#enemyInterface').style.display = 'block';
    document.querySelector('#battleInterface').style.display = 'flex';
    document.querySelector('#dialogueContainer').style.display = 'none';
    document.querySelector('#enemyHealthbar').style.width = '100%';
    document.querySelector('#playerHealthbar').style.width = '100%';
    battleBackground.draw()

    enemy = new Monster(monsters.small.Acerb);
    playerBattle = new Monster(players.Kemina);
    renderedSprites = [enemy, playerBattle];
    queue = [];

    playerBattle.attacks.forEach((attack) => {
        const btn = document.createElement('button')
        btn.innerHTML = attack.name
        document.querySelector('#attacksContainer').append(btn)
    })
    const attacksParent = document.querySelector('#attacksContainer');
    const removeChildren = (parent) => {
        while (parent.childElementCount > 0) {
            parent.removeChild(parent.firstChild);
        }
    };

    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML];
            playerBattle.attack({
                attack: selectedAttack,
                recipient: enemy,
                renderedSprites
            })

            if (enemy.health <= 0) {
                queue.push(() => {
                    enemy.faint()
                })
                queue.push(() => {
                    gsap.to('#blackFlash', {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId)
                            animate()
                            removeChildren(attacksParent)
                            document.querySelector('#battleInterface').style.display = 'none'
                            document.querySelector('#enemyInterface').style.display = 'none'
                            document.querySelector('#playerInterface').style.display = 'none'

                            gsap.to('#blackFlash', {
                                opacity: 0
                            })
                            battle.initiated = false

                        }
                    })
                })
            }

            const randomAttack = enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)]

            queue.push(() => {
                enemy.attack({
                    attack: randomAttack,
                    recipient: playerBattle,
                    renderedSprites
                })

                if (playerBattle.health <= 0) {
                    queue.push(() => playerBattle.faint())

                    queue.push(() => {
                        gsap.to('#blackFlash', {
                            opacity: 1,
                            onComplete: () => {
                                cancelAnimationFrame(battleAnimationId)
                                animate()
                                document.querySelector('#battleInterface').style.display = 'none'
                                document.querySelector('#enemyInterface').style.display = 'none'
                                document.querySelector('#playerInterface').style.display = 'none'
                                removeChildren(attacksParent)
                                gsap.to('#blackFlash', {
                                    opacity: 0
                                })

                                battle.initiated = false

                            }
                        })
                    })
                }
            })
        })
        btn.addEventListener('mouseenter', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            document.querySelector('#attackType').innerHTML = selectedAttack.type
            document.querySelector('#attackType').style.color = selectedAttack.color
        })
    })
}


const animateBattle = () => {
    battleAnimationId = window.requestAnimationFrame(animateBattle);
    battleBackground.draw();
    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}
animate();

document.querySelector('#dialogueContainer').addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    } else e.currentTarget.style.display = 'none'
})