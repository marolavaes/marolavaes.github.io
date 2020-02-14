// Teachable Machine
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/TeachableMachine/2-teachable-game.html
// https://editor.p5js.org/codingtrain/sketches/tqoOkW_ai
// modified to update the model without changing code by 
// Ali Karpuzoglu 
// alikarpuzoglu.com

// The video
let video;
let flipVideo;

// Storing the label
let label = "waiting...";

// The classifier
let classifier;
let modelURL ;
updateLink();
function updateLink(){
    modelURL = document.getElementById("link").value;
    console.log(modelURL)
}


// STEP 1: Load the model!
function preload() {
  classifier = ml5.imageClassifier(modelURL + 'model.json');
}

// Snake Game Variables
let snake;
let rez = 20;
let food;
let w;
let h;


function setup() {
  createCanvas(640, 480);
 
  // Setting up the game
  resetSketch();
  
  var button = createButton("reset");
  button.mousePressed(resetSketch);

}

function resetSketch(){
 // Create the video
 video = createCapture(VIDEO);
 video.size(640, 480);
 video.hide();
 // Mirror the video since we trained it that way!
 flipVideo = ml5.flipImage(video);

 // STEP 2: Start classifying
 classifyVideo();
// Snake Game
w = floor(width / rez);
h = floor(height / rez);
frameRate(5);
snake = new Snake();
foodLocation();
loop()
}

// STEP 2 classify!
function classifyVideo() {
  // Flip the video!
  flipVideo = ml5.flipImage(video);
  classifier.classify(flipVideo, gotResults);
}

// Snake Game
function foodLocation() {
  let x = floor(random(w));
  let y = floor(random(h));
  food = createVector(x, y);
}

// Control the game based on the label
function controlSnake() {
  if (label === "left") {
    snake.setDir(-1, 0);
  } else if (label === "right") {
    snake.setDir(1, 0);
  } else if (label === "down") {
    snake.setDir(0, 1);
  } else if (label === "up") {
    snake.setDir(0, -1);
  }
}

function draw() {
  background(255);

  // Draw the video?
  image(flipVideo, 0, 0);
  textSize(32);
  fill(0);
  text(label, 10, 50);

  // Draw the game
  scale(rez);
  if (snake.eat(food)) {
    foodLocation();
  }
  snake.update();
  snake.show();

  if (snake.endGame()) {
    background(255, 0, 0);
    textSize(50)
    textAlign(CENTER, CENTER);
    fill(0);
    text('END', 10, 50);
    print("END GAME");
    noLoop();
  }

  noStroke();
  fill(255, 0, 0);
  rect(food.x, food.y, 1, 1);
}

// STEP 3: Get the classification!
function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  // Control the snake and classify again!
  controlSnake();
  classifyVideo();
}