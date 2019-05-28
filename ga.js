// Genetic Algorithm

function nextGeneration() {
    console.log("Next generation");
    calculateFitness();
    for (let i = 0; i < POPULATION; i++) {
        players[i] = pickOne();
    }
    for (let i = 0; i < (POPULATION - 1); i++) {
        savedPlayers[i].dispose();
    }
    savedPlayers = [];
    food = [];

    addFood(true, POPULATION * 2);
}

function pickOne() {
    let index = 0;
    let r = random(1);
    while (r > 0) {
        r = r - savedPlayers[index].fitness;
        index++;
    }
    index--;
    let particle = savedPlayers[index];

    let child = new Bubble(particle.brain);
    child.mutate();
    return child;
}

function calculateFitness() {
    for (let particle of savedPlayers) {
        particle.calculateFitness();
        // console.log(particle.fitness);
    }

    // Normalize all values
    let sum = 0;

    for (let particle of savedPlayers) {
        sum += particle.fitness;
    }

    for (let particle of savedPlayers) {
        particle.fitness = particle.fitness / sum;
    }
}