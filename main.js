const SCENE_WIDTH = 2500;
const SCENE_HEIGHT = 2500;
const FOOD_VALUE = 0.2;
const FOOD_REFRESH_RATE = 8;
const BUBBLE_SIGHT = Infinity;
const MUTATION_RATE = 0.15;
const POPULATION = 180;
const LIFESPAN = 800;
const DECREASING_VALUE = 0.01;
const MAX_FOOD = 350;

let player;
let food = [];
let foodClock = 0;

let players = [];
let savedPlayers = [];

let speedSlider;

function setup() {
    createCanvas(SCENE_WIDTH, SCENE_HEIGHT);

    tf.setBackend("cpu");

    // player = new Bubble();

    for (let i = 0; i < POPULATION; i++) {
        players.push(new Bubble());
    }

    for (let i = 0; i < POPULATION * 2; i++) {
        food.push(new Food());
    }

    speedSlider = createSlider(1, 20, 1);

}

function draw() {

    const cycles = speedSlider.value();

    for (let n = 0; n < cycles; n++) {

        background(240);
        // drawAllGrid();
        // checkKeys();
        addFood();

        food.forEach(foodic => {
            foodic.show();
        });

        // player.show();

        players.forEach(player => {
            player.show();
            player.look();
            player.checkFoodCollision();
            player.checkPlayerCollision();
        });

        players.sort((a, b) => (a.values[0] > b.values[0]) ? 1 : -1);

        if (players.length == 0) {
            nextGeneration();
        }

        for (let i = players.length - 1; i >= 0; i--) {
            const bubble = players[i];

            if (bubble.dead) {
                savedPlayers.push(players.splice(i, 1)[0]);
            }
        }
    }

    // camera.position.x = player.position.x;
    // camera.position.y = player.position.y;
    // camera.zoom = pow(player.calculateValue(), -1) * 50;

}

// Functions

function drawGrid() {

    let distance = 20;

    distance += player.calculateValue() / 8;

    let sight = player.calculateValue() * 10;

    let a1 = (player.position.x - sight) - ((player.position.x - sight) % distance);
    let a2 = (player.position.x + sight) - ((player.position.x + sight) % distance);

    let b1 = (player.position.y - sight) - ((player.position.y - sight) % distance);
    let b2 = (player.position.y + sight) - ((player.position.y + sight) % distance);

    if (a1 < 0) a1 = 0;
    if (a2 > SCENE_WIDTH) a2 = SCENE_WIDTH + 1;
    if (b1 < 0) b1 = 0;
    if (b2 > SCENE_HEIGHT) b2 = SCENE_HEIGHT + 1;

    for (let x = a1; x < a2; x += distance) {
        for (let y = b1; y < b2; y += distance) {
            push();

            stroke(0, 4);
            strokeWeight(1);
            line(x, 0, x, b2);
            line(0, y, a2, y);

            pop();
        }
    }
}

function drawAllGrid() {

    let distance = 50;

    for (let x = 0; x < SCENE_WIDTH; x += distance) {
        for (let y = 0; y < SCENE_HEIGHT; y += distance) {

            push();
            stroke(0, 4);
            strokeWeight(1);
            line(x, 0, x, SCENE_HEIGHT);
            line(0, y, SCENE_WIDTH, y);
            pop();
        }
    }
}

function checkKeys() {
    if (keyIsDown(87) || keyIsDown(119)) {
        player.spit();
    }
}

function addFood(skip = false, number = 10) {

    if (!skip) {
        foodClock = (foodClock + 1) % FOOD_REFRESH_RATE;

        if (foodClock == 0 && food.length < MAX_FOOD) food.push(new Food());
    } else {
        for (let i = 0; i < number; i++) {
            food.push(new Food());
        }
    }
}