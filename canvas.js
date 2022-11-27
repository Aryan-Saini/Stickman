const doc = document;
const body = doc.querySelector('body');
const can = doc.querySelector('canvas');
const c = can.getContext("2d");

can.width = 1024;
can.height = 576;
const gravity = 0.2;


class Sprite {
  constructor({ pos, color }) {
    this.pos = pos;
    this.color = color;
    this.vel = {
      x: 0,
      y: 0
    };
    this.isAttacking = false;
    this.width = 50;
    this.height = 150;
    this.attackBox = {
      pos: this.pos,
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
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    c.fillStyle = 'white';
    c.fillRect(this.attackBox.pos.x, this.attackBox.pos.y, this.attackBox.width, this.attackBox.height);
  }

  update() {
    this.draw();
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.move();
    if (this.pos.y + this.height + this.vel.y >= can.height) {
      this.vel.y = 0;
      this.keys.w.activated = false;
    } else {
      this.vel.y += gravity;
    }
  }

  move() {
    if (Player.keys.a.pressed && Player.keys.lastKey == 'a') {
      Player.vel.x = -1;
    } else if (Player.keys.d.pressed && Player.keys.lastKey == 'd') {
      Player.vel.x = 1;
    } else {
      Player.vel.x = 0;
    }
    if (Player.keys.w.pressed && !Player.keys.w.activated) {
      Player.vel.y = -10;
      Player.keys.w.activated = true;
      console.log(this.keys.w.activated);
    } else if (Player.keys.s.pressed && Player.keys.lastKey == 's') {

    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100)
  }

}

const Player = new Sprite({
  pos: {
    x: 0,
    y: 0
  }, color: 'red',
});

const Enemy = new Sprite({
  pos: {
    x: 400,
    y: 100
  }, color: 'green'
});

function detectCollioson() {
  if (Player.attackBox.pos.x + Player.attackBox.width >= Enemy.pos.x
    && Player.attackBox.pos.x <= Enemy.pos.x + Enemy.width
    && Player.attackBox.pos.y + Player.attackBox.height >= Enemy.pos.y
    && Player.attackBox.pos.y <= Enemy.pos.y + Enemy.height
    && Player.isAttacking) {
    console.log("go");
  }
}

function animate() {
  window.requestAnimationFrame(animate);

  c.fillStyle = "black";
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