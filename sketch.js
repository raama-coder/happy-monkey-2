// Variable definitions
var PLAY = 1
var END = 0
var gameState = PLAY;
var monkey, monkey_running;
var banana, bananaImage, obstacle, obstacleImage;
var FoodGroup, obstacleGroup;
var ground;
var score = 0;
var end, endImage;
var bg, bgImage;

// Preloading all the images and resources
function preload() {

  monkey_running = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png");

  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");

  endImage = loadImage("end.png");

  bgImage = loadImage("jungle.png");
}

// creating objects in setup()
function setup() {
  createCanvas(500, 500);

  bg = createSprite(0, 250, 0, 0);
  bg.addImage("movingBg", bgImage);
  bg.scale = 0.27;
  bg.width = 600;

  monkey = createSprite(80, 445, 10, 10);
  monkey.addAnimation("moving", monkey_running);
  monkey.scale = 0.18;


  banana = createSprite(0, 0, 0, 0);

  obstacle = createSprite(0, 0, 0, 0);

  ground = createSprite(250, 495, 600, 10);
  ground.visible = false

  FoodGroup = new Group();
  obstacleGroup = new Group();

  monkey.setCollider("circle", 0, -10, monkey.width / 1.7);
}

function draw() {

  background("white");
  bg.depth = monkey.depth;
  monkey.depth = bg.depth + 1;
  obstacle.depth = bg.depth + 1;
  banana.depth = bg.depth + 1;

  // Game state conditional execution
  if (gameState === PLAY) {

    // Making infinite scrolling screen   
    bg.velocityX = -3;
    if (bg.x < 50) {
      bg.x = bg.width / 2;
    }

    // calling functtion to display bananas at random positions
    popBanana();

    //calling function to make monkey jump 
    jump();

    // calling functtion to randomly display obstacles.
    popObstacle();

    //When monkey eats banana
    eatBanana();

    // making sure that monkey does not fall off the ground
    monkey.collide(ground);

    // Score which is survival time
    score = score + Math.round(getFrameRate() / 50);
    // condition to end the game
    if (obstacleGroup.isTouching(monkey)) {
      gameState = END;
    }
  } else if (gameState === END) {
    // setting when game ends. 
    obstacle.lifetime = -1;
    banana.lifetime = 0;
    monkey.lifetime = -1;

    //Game end messaging
    endTheGame();
  }

  drawSprites();

  // Score board
  textSize(36);
  fill("Gold");
  text("Suvival time: " + score, 150, 50);
}

// Creating bananas
function popBanana() {
  if (frameCount % 80 === 0) {
    var bananaY = Math.round(random(120, 200));
    banana = createSprite(500, bananaY, 10, 10);
    banana.addImage(bananaImage);
    banana.scale = 0.1;
    banana.velocityX = -10;
    banana.lifetime = 50;
    banana.y = bananaY;
    FoodGroup.add(banana);
    banana.setCollider("circle", 0, -10, banana.width / 1.7);
  }
}

// Creating obstacles
function popObstacle() {
  if (frameCount % 300 === 0) {
    obstacle = createSprite(550, 440, 10, 10);
    obstacle.addImage(obstacleImage);
    obstacle.scale = 0.4;
    obstacle.velocityX = -10;
    obstacle.lifetime = 5.5;
    obstacleGroup.add(obstacle);
    obstacle.setCollider("circle", -20, 10, obstacle.width / 2.2);
  }
}

// Making monkey to jump up
function jump() {
  // setting up gravity for monkey so that it falls down after it jumps up
  monkey.velocityY = monkey.velocityY + 0.2;



  if (keyDown("space") && monkey.y >= 430) {
    monkey.velocityY = -10;
  }
  if (monkey.isTouching(ground)) {
    monkey.scale = 0.18;
  }
}

// Display when game ends.
function endTheGame() {
  monkey.scale = 0.10;
  bg.x = 0;
  bg.velocityX = 0;
  bg.scale = 0.40;
}

// function for what happens when monkey eats banana
function eatBanana() {
  if (monkey.isTouching(FoodGroup)) {
    banana.destroy();
    monkey.scale = 0.24;
  }
}