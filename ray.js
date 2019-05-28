class Ray {
    constructor(position, angle) {
        this.position = position;
        this.angle = angle;
        this.direction = p5.Vector.fromAngle(angle);
    }

    lookAt(x, y) {
        this.direction.x = x - this.position.x;
        this.direction.y = y - this.position.y;
        this.direction.normalize();
    }

    show() {
        stroke(255);
        
        push();
        translate(this.position.x, this.position.y);
        line(0, 0, this.direction.x * 10, this.direction.y * 10);
        pop();
    }

    rotate(offset) {
        this.direction = p5.Vector.fromAngle(this.angle + offset);
    }

    cast(dot) {
        line(this.position.x, this.position.y, dot.x, dot.y);
    }
}