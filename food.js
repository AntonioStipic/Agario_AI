class Food {
    constructor(x = random(SCENE_WIDTH), y = random(SCENE_HEIGHT)) {
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.maxForce = 5.5;
        this.radius = 12;
        this.value = FOOD_VALUE;

        this.red = random(255);
        this.green = random(255);
        this.blue = random(255);
    }

    push(angle) {
        this.velocity = p5.Vector.fromAngle(angle).mult(5);
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.limit(this.maxForce);

        if (this.velocity.x != 0 || this.velocity.y != 0) this.maxForce -= 0.1;
    }

    show() {

        this.update();

        push();
        translate(0, 0, 0);
        stroke(this.red, this.green, this.blue);
        fill(this.red, this.green, this.blue);
        circle(this.position.x, this.position.y, this.radius);
        pop();
    }
}