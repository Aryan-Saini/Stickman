const doc = document;
const body = doc.querySelector('body');
const can = doc.querySelector('canvas');
const c = can.getContext("2d");
const health = doc.getElementById("barOne");
const healthEne = doc.getElementById("barTwo");
const time = doc.getElementById("time");
const gravity = 0.2;
can.width = 1280;
can.height = 780;
var timer = 60;
time.innerHTML = timer;


function timerDec() {
  setTimeout(timerDec, 1000)
  if (timer > 0) {
    timer--;
    time.innerHTML = timer;
  } else {
    checkWin();
  }
}
timerDec();



class Sprite {
  constructor({ pos, color, offset }) {
    this.pos = pos;
    this.color = color;
    this.vel = {
      x: 0,
      y: 0
    };
    this.isAttacking = false;
    this.width = 50;
    this.height = 150;
    this.isBlocking = false;
    this.attackBox = {
      pos: {
        x: this.pos.x,
        y: this.pos.y
      },
      offset,
      width: 100,
      height: 50
    };
    this.keys = {
      a: {
        pressed: false
      },
      d: {
        pressed: false
      },
      w: {
        pressed: false,
        activated: false
      },
      s: {
        pressed: false
      },

      lastKey: ''
    };
    this.health = 100;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    //unccoment 
    if (this.isAttacking) {
      c.fillStyle = 'white';
      c.fillRect(this.attackBox.pos.x, this.attackBox.pos.y, this.attackBox.width, this.attackBox.height);
    }

  }

  update() {
    this.draw();


    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.attackBox.pos.x = this.pos.x + this.attackBox.offset.x;
    this.attackBox.pos.y = this.pos.y;
    this.move();
    if (this.pos.y + this.height + this.vel.y >= can.height) {
      this.vel.y = 0;
      this.keys.w.activated = false;
    } else {
      this.vel.y += gravity;
    }
  }

  move() {
    if (this.keys.a.pressed && this.keys.lastKey == 'a' && this.pos.x >= 0) {
      this.vel.x = -1;
    } else if (this.keys.d.pressed && this.keys.lastKey == 'd' && this.pos.x + this.width <= can.width) {
      this.vel.x = 1;
    } else {
      this.vel.x = 0;
    }
    if (this.keys.w.pressed && !this.keys.w.activated) {
      this.vel.y = -10;
      this.keys.w.activated = true;
      console.log(this.keys.w.activated);
    } else if (this.keys.s.pressed && this.keys.lastKey == 's') {

    }
  }

  attack(type) {

    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100)
    console.log("attack");
    if (type == 1) {

      //punch by click
    } else if (type == 2) {
      //kick by space
    }
  }

  block() {
    // by right click quick block
    if (!this.isAttacking) {
      console.log("block");
      this.isBlocking = true;
      setTimeout(() => {
        this.isBlocking = false;
      }, 100)
    }
  }

}

const Player = new Sprite({
  pos: {
    x: 0,
    y: 0
  }, color: 'red',
  offset: {
    x: 0,
    y: 0
  }
});

const Enemy = new Sprite({
  pos: {
    x: 400,
    y: 100
  }, color: 'green',
  offset: {
    x: -50,
    y: 0
  }
});

function retangularColli({ rectangle1, rectangle2 }) {
  return (rectangle1.attackBox.pos.x + rectangle1.attackBox.width >= rectangle2.pos.x
    && rectangle1.attackBox.pos.x <= rectangle2.pos.x + rectangle2.width
    && rectangle1.attackBox.pos.y + rectangle1.attackBox.height >= rectangle2.pos.y
    && rectangle1.attackBox.pos.y <= rectangle2.pos.y + rectangle2.height
    && rectangle1.isAttacking)
}

function detectCollioson() {
  if (retangularColli({ rectangle1: Player, rectangle2: Enemy })) {
    Player.isAttacking = false;
    Enemy.health -= 13;
    healthEne.style.width = `${Enemy.health}%`;

    if (Enemy.health == 0) {

    }
  } else if (retangularColli({ rectangle1: Enemy, rectangle2: Player })) {
    Enemy.isAttacking = false;
    Player.health -= 13;
    health.style.width = `${Player.health}%`;
  }
}

function checkWin() {
  if (Player.health === Enemy.health) {

  } else if (Enemy.health === 0) {

  } else if (Player.health === 0) {

  }
}

function animate() {

  window.requestAnimationFrame(animate);

  c.fillStyle = "white";
  c.fillRect(0, 0, can.width, can.height);
  Player.update();
  Enemy.update();
  detectCollioson();
}



window.addEventListener("keydown", (event) => {
  switch (event.key.toLowerCase()) {
    case 'd':
      Player.keys.d.pressed = true;
      Player.keys.lastKey = 'd';
      break;
    case 'a':
      Player.keys.a.pressed = true;
      Player.keys.lastKey = 'a';
      break;
    case 'w':
      Player.keys.w.pressed = true;
      break;
    case 's':
      Player.keys.a.pressed = true;
      Player.keys.lastKey = 'a';
      break;
    case ' ':
      Player.attack(2)
      break;
  }
});

window.addEventListener("mousedown", (event) => {
  console.log(event);
  switch (event.buttons) {
    case 1:
      Player.attack(1)
      break;
    case 2:
      Player.block()
      break;
  }

});
window.addEventListener("keyup", (event) => {
  switch (event.key.toLowerCase()) {
    case 'd':
      Player.keys.d.pressed = false;
      break;
    case 'a':
      Player.keys.a.pressed = false;
      break;
    case 'w':
      Player.keys.w.pressed = false;
      break;
    case 's':
      Player.keys.a.pressed = false;
      break;
  }
});


animate();