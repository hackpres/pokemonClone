class Sprite {
    constructor({
        position,
        image,
        frames = { max: 1, hold: 10 },
        sprites = [],
        animate = false,
        isEnemy = false,
        rotation = 0,
        name,
        attacks
    }) {
        this.position = position
        this.image = image
        this.frames = {...frames, val: 0, elapsed: 0}
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.animate = animate
        this.sprites = sprites
        this.opacity = 1
        this.health = 100
        this.isEnemy = isEnemy
        this.rotation = rotation
        this.name = name
        this.attacks = attacks
    }
    draw() {
        c.save()
        c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2)
        c.rotate(this.rotation)
        c.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2)
        c.globalAlpha = this.opacity
        c.drawImage(this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        );
        c.restore()
        if (!this.animate) {
            return
        }
        if (this.frames.max > 1) {
            this.frames.elapsed++
        }
        if (this.frames.elapsed % this.frames.hold === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++;
                else this.frames.val = 0;
        }
    }
}

class Monster extends Sprite {
    constructor({
        position,
        image,
        frames = { max: 1, hold: 10 },
        sprites,
        animate = false,
        rotation = 0,
        isEnemy = false,
        name,
        attacks,
    }) {
        super(
            position,
            image,
            frames,
            sprites,
            animate,
            rotation,
        )
        this.health = 100 
        this.isEnemy = isEnemy
        this.name = name
        this.attacks = attacks
    }
    faint() {
        document.querySelector('#dialogeContainer').innerHTML = `${this.name} fainted!`
        gsap.to(this.position, {
            y: this.position.y + 20
        })
        gsap.to(this, {
            opacity: 0
        })
    }
    attack({ attack, recipient, renderedSprites }) {
        document.querySelector('#dialogeContainer').style.display = 'block'
        document.querySelector('#dialogeContainer').innerHTML = `${this.name} used ${attack.name}.`
        let healthbarEl = '#enemyHealthbar'
        if (this.isEnemy)  healthbarEl = '#playerHealthbar'
        recipient.health -= attack.damages
        let rotation = 1
        if(this.isEnemy) rotation = -2.2
        const tl = gsap.timeline();
        switch (attack.name) {
            case 'Fireball':
                const fireballImg = new Image()
                fireballImg.src = './img/sprites/attacks/fireball.png'
                const fireball = new Sprite({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    image: fireballImg,
                    frames: {
                        max: 4,
                        hold: 10
                    },
                    animate: true,
                    rotation
                })
                gsap.to(this.position, {
                    y: this.position.y - 15,
                    repeat: 1,
                    yoyo: true,
                    duration: .6,
                    onComplete() {
                        renderedSprites.splice(1, 0, fireball)
                        gsap.to(fireball.position, {
                            x: recipient.position.x,
                            y: recipient.position.y,
                            onComplete: () => {
                                renderedSprites.splice(1, 1)
                                gsap.to(healthbarEl, {
                                    width: recipient.health - attack.damage + '%'
                                })
                                gsap.to(recipient.position, {
                                    x: recipient.position.x + 10,
                                    repeat: 1,
                                    yoyo: true,
                                    duration: .08
                                })
                                gsap.to(recipient, {
                                    opacity: 0,
                                    repeat: 5,
                                    yoyo: true,
                                    duration: .08,
                                })
                            }
                        })
                    }
                })
                
                
                break;
            case 'Tackle':
                let movementDistance = 20
                if (this.isEnemy) movementDistance = - 20

                tl.to(this.position, {
                    x: this.position.x - movementDistance * 1.5,
                    y: this.position.y - 8,
                }).to(this.position, {
                    y: this.position.y + 8,
                }).to(this.position, {
                    x: this.position.x + movementDistance * 2.2,
                    duration: .1,
                    onComplete() {
                        gsap.to(healthbarEl, {
                            width: recipient.health - attack.damage + '%'
                        })
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            repeat: 1,
                            yoyo: true,
                            duration: .08
                        })
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: .08,
                        })
                    }
                }).to(this.position, {
                    x: this.position.x - movementDistance * .7,
                    duration: .8,
                })
                break;
        }
    }
}