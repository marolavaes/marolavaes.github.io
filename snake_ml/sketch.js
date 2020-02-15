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
var started = false;


// Storing the label
let label = "waiting...";

// The classifier
let classifier;
let modelURL ;

let previousType='image';
let type = 'image';
updateLink();
function updateLink(){
    modelURL = document.getElementById("link").value;
    preload();
}

function change(newType){
    if(previousType!=newType){
        type = newType;
        previousType = newType;
        console.log(type);
    }
}

// STEP 1: Load the model!
function preload() {
    switch(type) {
        case 'pose':
            console.log('not supported yet');
            classifier = ml5.imageClassifier(modelURL + 'model.json');
          break;
        case 'audio':
            classifier = ml5.soundClassifier(modelURL + 'model.json');
        break;
        case 'image':
            classifier = ml5.imageClassifier(modelURL + 'model.json');
            break;
        default: // image
        classifier = ml5.imageClassifier(modelURL + 'model.json');
      }
}

// Snake Game Variables
let snake;
let rez = 20;
let food;
let w;
let h;

function start(){
    if(!started){
    video = createCapture(VIDEO);
    }

    started = true;
    
    resetSketch();

 }

function setup() {
  var canvas = createCanvas(620, 480);
  canvas.parent('sketch-holder');
  
  var button = createButton("reset");
  button.parent('sketch-holder');
  button.mousePressed(resetSketch);
  var buttons = document.getElementsByTagName('button');

  buttons[buttons.length-1].className='aesthetic-windows-95-button'
  noLoop();
  // Setting up the game



}

function resetSketch(){
 // Create the video
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
    if(started){
  background(255);

  // Draw the video?
  tint(0, 153, 204, 200); // Tint blue and set transparency
 
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
    background(250, 119, 133);
    print("END GAME");
    noLoop();
  }

  noStroke();
  fill(255, 0, 0);
  rect(food.x, food.y, 1, 1);
}}

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