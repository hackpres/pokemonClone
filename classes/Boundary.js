class Boundary {
    static width = 48;
    static height = 48;
    constructor({
        position,
        width,
        height
    }) {
        this.position = position
        this.width = width
        this.height = height
    }
    draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0)';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

