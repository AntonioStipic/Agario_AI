class Bubble {
    constructor(brain) {

        this.position = createVector(random(SCENE_WIDTH), random(SCENE_HEIGHT));
        this.velocity = createVector();
        this.acceleration = createVector();
        this.maxSpeed = 15;
        this.maxForce = 2;
        this.values = [30];
        this.readyToSpit = true;
        this.spitClock = 0;
        this.counter = 0;
        this.bubbles = 1;
        this.dead = false;
        this.sight = BUBBLE_SIGHT;
        this.fitness = 0;
        this.lifespan = LIFESPAN;

        // this.rays = [];

        // for (let a = 0; a < 360; a += 5) {
        //     this.rays.push(new Ray(this.position, radians(a)));
        // }

        this.red = random(255);
        this.green = random(255);
        this.blue = random(255);

        if (brain) {
            this.brain = brain.copy();
        } else {
            // this.brain = new NeuralNetwork(POPULATION * 2 + 1, POPULATION * 3, 1);
            this.brain = new NeuralNetwork(5, 10, 1);
        }

    }

    mutate() {
        this.brain.mutate(MUTATION_RATE);
    }

    dispose() {
        this.brain.dispose();
    }

    checkBounds() {
        if (this.position.x < 0) this.position.x = 0;
        if (this.position.y < 0) this.position.y = 0;
        if (this.position.x > SCENE_WIDTH) this.position.x = SCENE_WIDTH;
        if (this.position.y > SCENE_HEIGHT) this.position.y = SCENE_HEIGHT;
    }

    update() {
        this.sight = BUBBLE_SIGHT + this.values[0];

        this.values[0] -= DECREASING_VALUE;

        // this.velocity = createVector(camera.mouseX, camera.mouseY).sub(this.position);
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.set(0, 0);

        if (!this.readyToSpit) {
            if (this.spitClock == 5) {
                this.spitClock = 0;
                this.readyToSpit = true;
            } else {
                this.spitClock++;
            }
        }

        this.counter++;
        if (this.counter > this.lifespan) {
            this.dead = true;
        }

        this.checkBounds();
    }

    calculateFitness() {
        this.fitness = pow(2, this.values[0]);
    }

    look() {
        const inputs = [];

        let record = this.sight;
        let recordIndex;

        let shortestVector;

        for (let i = 0; i < players.length; i++) {
            const pt = players[i].position;

            const d = p5.Vector.dist(this.position, pt);

            // inputs.push(d);
            // inputs.push(this.values[0] - players[i].values[0]);

            // console.log(inputs);

            if (d < record && d < this.sight && d != 0) {
                record = d;
                recordIndex = i;
                shortestVector = createVector(players[i].position.x - this.position.x, players[i].position.y - this.position.y);
            }
            // record = min(d, record);
        }

        // if (players.length > 1) {
        //     console.log("Heading:", shortestVector.heading(), "Distance:", record);
        //     line(this.position.x, this.position.y, players[recordIndex].position.x, players[recordIndex].position.y);
        // }

        if (players.length > 1) {
            inputs.push(shortestVector.heading());
            inputs.push(record);
            inputs.push(this.values[0] - players[recordIndex].values[0]);
        } else {
            inputs.push(0);
            inputs.push(0);
            inputs.push(0);
        }

        //////////////////////////////

        record = this.sight;
        let foodRecordIndex;
        for (let i = 0; i < food.length; i++) {
            const pt = food[i].position;

            const d = p5.Vector.dist(this.position, pt);

            if (d < record && d < this.sight) {
                record = d;
                foodRecordIndex = i;
                shortestVector = createVector(food[i].position.x - this.position.x, food[i].position.y - this.position.y);
            }
        }

        // line(this.position.x, this.position.y, food[foodRecordIndex].position.x, food[foodRecordIndex].position.y);

        inputs.push(shortestVector.heading());
        inputs.push(record);

        // while (inputs.length != POPULATION * 2 + 1) inputs.push(0);

        //players.forEach(player => {
        //const pt = player.position;

        // if (pt != this.position) {

        //const d = p5.Vector.dist(this.position, pt);
        //console.log(d);

        //inputs[0].push(map(d, 0, this.sight, 1, 0));
        // }

        /* if (pt) {
            const d = p5.Vector.dist(this.position, pt);
            console.log(d);
            if (d < this.sight && d != 0) {
                closest = pt;
            }
            record = min(d, record);
        } */
        //});

        /* food.forEach(foodic => {
            const pt = foodic.position;

            const d = p5.Vector.dist(this.position, pt);

            inputs[1].push([map(d, 0, this.sight, 1, 0)]);
        }); */

        /* this.rays.forEach(ray => {

            let closest = null;
            let record = this.sight;

            

            /* if (record < this.maxSpeed - 1) {
                this.dead = true;
            }

            if (closest) {
                // stroke(255, 100);
                // line(this.position.x, this.position.y, closest.x, closest.y);
            } */
        //});

        // console.log(inputs);
        const output = this.brain.predict(inputs);
        let angle = map(output[0], 0, 1, 0, TWO_PI);
        // console.log(degrees(angle));
        // console.log(this.velocity.heading());
        // let angle = PI;
        // angle += this.velocity.heading();
        const speed = p5.Vector.fromAngle(angle);
        // speed.limit(this.maxSpeed);
        // speed.sub(this.velocity);
        // speed.limit(this.maxForce);
        // this.applyForce(speed);
        this.velocity = speed;
    }

    applyForce(force) {
        this.velocity.add(force);
    }

    show() {
        if (!this.dead) {
            this.update();

            push();

            for (let i = 0; i < this.bubbles; i++) {
                fill(this.red, this.green, this.blue);
                translate(this.position.x, this.position.y);
                circle(0, 0, this.values[i]);
            }

            pop();
        }
    }

    calculateValue() {
        let sum = 0;

        for (let i = 0; i < this.bubbles; i++) {
            sum += this.values[i];
        }

        return sum;
    }

    checkFoodCollision() {
        for (let i = 0; i < food.length; i++) {
            for (let e = 0; e < this.bubbles; e++) {
                let hit = collideCircleCircle(this.position.x, this.position.y, this.values[e], food[i].position.x, food[i].position.y, food[i].radius);
                if (hit) {
                    this.values[e] += food[i].value;
                    food.splice(i, 1);

                    this.counter = 0;
                }
            }
        }
    }

    checkPlayerCollision() {
        for (let i = 0; i < players.length; i++) {
            // this.rays.forEach(ray => {
            //     ray.cast(players[i].position);
            // });

            for (let e = 0; e < this.bubbles; e++) {
                let hit = collideCircleCircle(this.position.x, this.position.y, this.values[e] - players[i].values[0] / 2, players[i].position.x, players[i].position.y, players[i].values[0]);
                if (hit && this.values[e] > players[i].values[0]) {
                    this.values[e] += players[i].values[0] / (PI);
                    savedPlayers.push(players[i]);
                    players[i].dead = true;
                    players.splice(i, 1);

                    this.counter = 0;
                }
            }
        }
    }

    spit() {
        for (let i = 0; i < this.bubbles; i++) {
            if (this.values[i] > 30 && this.readyToSpit) {
                this.readyToSpit = false;
                let spitFoodPosition = createVector(this.position.x, this.position.y).add(p5.Vector.fromAngle(this.velocity.heading()).mult(this.values[i]));
                let spitFood = new Food(spitFoodPosition.x, spitFoodPosition.y);
                spitFood.push(this.velocity.heading());

                this.values[i] -= FOOD_VALUE;

                food.push(spitFood);
            }
        }
    }
}