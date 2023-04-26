// Canvas setup
const CANVAS = document.querySelector("#canvas1");
CANVAS.width = 800;
CANVAS.height = 500;
const CTX = CANVAS.getContext("2d");
const BUBBLE_POP1 = document.createElement("audio");
BUBBLE_POP1.src = "bubbles-single1.wav";
const BUUBLE_POP2 = document.createElement("audio");
BUUBLE_POP2.src = "bubbles-single2.wav";
const BUBBLE_IMAGE = new Image()
BUBBLE_IMAGE.src = 'img/bubble_pop_frame_01.png';


const BG = {
  x1: 0,
  x2: CANVAS.width,
  y: 0,
  width: CANVAS.width,
  height: CANVAS.height,
};

let gameSpeed = 1;
let score = 0;
let gameFrame = 0;
CTX.font = "50px Georgia";
// Mouse Interactivity
let canvasPosition = CANVAS.getBoundingClientRect();

const MOUSE_TRACKING = {
  x: CANVAS.width / 2,
  y: CANVAS.height / 2,
  click: false,
};

CANVAS.addEventListener("mousedown", function (event) {
  MOUSE_TRACKING.click = true;
  MOUSE_TRACKING.x = event.x - canvasPosition.left;
  MOUSE_TRACKING.y = event.y - canvasPosition.top;
});
CANVAS.addEventListener("mouseup", function () {
  MOUSE_TRACKING.click = false;
});

// Player
const PLAYER_LEFT = new Image();
PLAYER_LEFT.src = "img/fish_swim_left.png";
const PLAYER_RIGHT = new Image();
PLAYER_RIGHT.src = "img/fish_swim_right.png";
class Player {
  constructor() {
    this.x = CANVAS.width / 2;
    this.y = CANVAS.height / 2;
    this.radius = 50;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 498;
    this.spriteHeight = 327;
  }
  update() {
    const DX = this.x - MOUSE_TRACKING.x;
    const DY = this.y - MOUSE_TRACKING.y;
    let theta = Math.atan2(DY, DX);
    this.angle = theta;
    if (MOUSE_TRACKING.x != this.x) {
      this.x -= DX / 20;
    }
    if (MOUSE_TRACKING.y != this.y) {
      this.y -= DY / 20;
    }
  }
  draw() {
    if (MOUSE_TRACKING.click) {
      CTX.lineWidth = 0.2;
      CTX.beginPath();
      CTX.moveTo(this.x, this.y);
      CTX.lineTo(MOUSE_TRACKING.x, MOUSE_TRACKING.y);
      CTX.stroke();
    }
    CTX.fillStyle = "red";
    CTX.beginPath();
    CTX.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    CTX.fill();
    CTX.closePath();
    CTX.fillRect(this.x, this.y, this.radius, 10);
    CTX.save();
    CTX.translate(this.x, this.y);
    CTX.rotate(this.angle);
    if (this.x >= MOUSE_TRACKING.x) {
      CTX.drawImage(
        PLAYER_LEFT,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        0 - 60,
        0 - 45,
        this.spriteWidth / 4,
        this.spriteHeight / 4
      );
    } else {
      CTX.drawImage(
        PLAYER_RIGHT,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        0 - 60,
        0 - 45,
        this.spriteWidth / 4,
        this.spriteHeight / 4
      );
    }
    CTX.restore();
  }
}
const PLAYER = new Player();

const bubblesArray = [];

class Bubble {
  constructor() {
    this.x = Math.random() * CANVAS.width;
    this.y = CANVAS.height + Math.random() * CANVAS.height;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
    this.sound = Math.random() <= 0.5 ? "sound1" : "sound2";
  }
  update() {
    this.y -= this.speed;
    const DX = this.x - PLAYER.x;
    const DY = this.y - PLAYER.y;
    this.distance = Math.sqrt(DX * DX + DY * DY);
  }
  draw() {
    // CTX.fillStyle = "blue";
    // CTX.beginPath();
    // CTX.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // CTX.fill();
    // CTX.closePath();
    // CTX.stroke();
    CTX.drawImage(BUBBLE_IMAGE, this.x - 65, this.y - 65, this.radius*2.6, this.radius*2.6);
  }
}

function bubblesHandler() {
  if (gameFrame % 50 == 0) {
    bubblesArray.push(new Bubble());
  }
  for (let i = 0; i < bubblesArray.length; i++) {
    bubblesArray[i].update();
    bubblesArray[i].draw();
  }
  for (let i = 0; i < bubblesArray.length; i++) {
    if (bubblesArray[i] < 0) {
      bubblesArray.splice(i, 1);
    }
    if (bubblesArray[i].distance < bubblesArray[i].radius + PLAYER.radius) {
      if (!bubblesArray[i].counted) {
        if (bubblesArray[i].sound == "sound1") {
          BUBBLE_POP1.play();
        } else {
          BUUBLE_POP2.play();
        }
        score++;
        bubblesArray[i].counted = true;
        bubblesArray.splice(i, 1);
      }
    }
  }
}

// Background

const background = new Image();
background.src = "img/background1.png";

const backgroundHandler = () => {
  BG.x1 -= gameSpeed;
  if (BG.x1 < -BG.width) {
    BG.x1 = BG.width;
  }
  BG.x2 -= gameSpeed;
  if (BG.x2 < -BG.width) {
    BG.x2 = BG.width;
  }
  CTX.drawImage(background, BG.x1, BG.y, BG.width, BG.height);
  CTX.drawImage(background, BG.x2, BG.y, BG.width, BG.height);
};

// Animation
function Animate() {
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
  backgroundHandler();
  bubblesHandler();
  PLAYER.update();
  PLAYER.draw();
  CTX.fillStyle = "black";
  CTX.fillText(`Score: ${score}`, 10, 50);
  gameFrame++;
  requestAnimationFrame(Animate);
}

Animate();

window.addEventListener("resize", () => {
  canvasPosition = CANVAS.getBoundingClientRect();
});
