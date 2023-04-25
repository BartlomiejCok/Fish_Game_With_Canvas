// Canvas setup
const CANVAS = document.querySelector('#canvas1');
CANVAS.width = 800;
CANVAS.height = 500;
const CTX = CANVAS.getContext('2d');

let score = 0;
let gameFrame = 0;
CTX.font ='50px Georgia';
// Mouse Interactivity
let canvasPosition = CANVAS.getBoundingClientRect();

const MOUSE_TRACKING ={
  x: CANVAS.width/2,
  y: CANVAS.height/2,
  click: false
  }

CANVAS.addEventListener('mousedown', function(event){
MOUSE_TRACKING.click = true;
MOUSE_TRACKING.x = event.x - canvasPosition.left;
MOUSE_TRACKING.y = event.y - canvasPosition.top;
console.log(MOUSE_TRACKING.x, MOUSE_TRACKING.y);
});
CANVAS.addEventListener('mouseup', function() {
  MOUSE_TRACKING.click = false;
});

// Player

class Player {
  constructor() {
    this.x = CANVAS.width/2;
    this.y = CANVAS.height/2;
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
    if(MOUSE_TRACKING.x != this.x) {
      this.x -= DX/30;
    }
    if(MOUSE_TRACKING.y != this.y) {
      this.y -= DY/30;
    }
  }
  draw() {
    if(MOUSE_TRACKING.click) {
      CTX.lineWidth = 0.2;
      CTX.beginPath();
      CTX.moveTo(this.x, this.y);
      CTX.lineTo(MOUSE_TRACKING.x, MOUSE_TRACKING.y);
      CTX.stroke();
    }
    CTX.fillStyle = 'red';
    CTX.beginPath();
    CTX.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    CTX.fill();
    CTX.closePath();
    CTX.fillRect(this.x,this.y,this.radius,10);
  }
}
const PLAYER = new Player();

// Animation
function Animate(){
  PLAYER.update();
  PLAYER.draw();
  requestAnimationFrame(Animate);
}

Animate();