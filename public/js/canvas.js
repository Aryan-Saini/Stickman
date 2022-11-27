

const doc = document;
const body = doc.querySelector('body');
const can = doc.querySelector('canvas');
const c = can.getContext("2d");
const health = doc.getElementById("barOne");
const healthEne = doc.getElementById("barTwo");
const time = doc.getElementById("time");
const play1 = doc.getElementById("play1");
const play2 = doc.getElementById("play2");
const gravity = 0.2;
can.width = 1280;
can.height = 780;
var timer = 60;
time.innerHTML = timer;

class Sprite {
  constructor({ pos, color, offset, username, id }) {
    this.pos = pos;
    this.color = color;
    this.refHealth;
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
    this.username = username;
    this.id = id;
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

  updateEverything(itm) {
    this.attackBox = itm.attackBox;
    this.isAttacking = itm.isAttacking;
    this.keys = itm.keys;
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

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

socket.emit('joinRoom', { username, room });

socket.on('message', message => {
  console.log(message);
});

socket.on('redirect', message => {
  if (message === "/") {
    window.location.href = "http://localhost:3000/";
  }
});

let Players = [new Sprite({
  pos: {
    x: 0,
    y: 0
  }, color: 'red',
  offset: {
    x: 0,
    y: 0
  },
  username: "itm.username",
  id: "itm.id"
}), new Sprite({
  pos: {
    x: 0,
    y: 0
  }, color: 'red',
  offset: {
    x: 0,
    y: 0
  },
  username: "itm.username",
  id: "itm.id"
})];

let mainPlayer;
let enemy;
function assighnPlayers(users) {
  Players = users.map((itm) => new Sprite({
    pos: {
      x: 0,
      y: 0
    }, color: 'red',
    offset: {
      x: 0,
      y: 0
    },
    username: itm.username,
    id: itm.id
  }));
  console.log(Players);

  if (socket.id == Players[0].id) {
    Players[0].pos.x = can.width / 4;
    Players[0].pos.y = 300;
    Players[0].refHealth = health;
    play1.innerHTML = Players[0].username;
    mainPlayer = Players[0];
  } else {
    Players[1].pos.x = can.width / 2 + can.width / 4;
    Players[1].pos.y = 300;
    mainPlayer = Players[1];
    Players[0].color = "black";
    Players[0].pos.x = can.width / 4;
    Players[0].pos.y = 300;
    Players[1].refHealth = healthEne;
    Players[0].refHealth = health;
    play1.innerHTML = Players[0].username;
    play2.innerHTML = Players[1].username;
    enemy = Players[0];
  }


  if (users.length == 2 && socket.id == Players[0].id) {
    Players[1].color = "black";
    Players[1].pos.x = can.width / 2 + can.width / 4;
    Players[1].pos.y = 300;
    Players[1].refHealth = healthEne;
    play2.innerHTML = Players[1].username;
    enemy = Players[1];
  }

};


socket.on('roomUsers', users => {
  assighnPlayers(users.users);
})

socket.on('EnemyMovement', ene => {
  if (mainPlayer.id != ene.id) {
    console.log(enemy);
    console.log(ene);
    enemy.updateEverything(ene);
    enemy.color = "black";
  }
})

socket.on("EnemyMovement", ene => {
  if (mainPlayer.id == ene.id) {
    mainPlayer.health == ene.health;
  }
})


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


function retangularColli({ rectangle1, rectangle2 }) {
  return (rectangle1.attackBox.pos.x + rectangle1.attackBox.width >= rectangle2.pos.x
    && rectangle1.attackBox.pos.x <= rectangle2.pos.x + rectangle2.width
    && rectangle1.attackBox.pos.y + rectangle1.attackBox.height >= rectangle2.pos.y
    && rectangle1.attackBox.pos.y <= rectangle2.pos.y + rectangle2.height
    && rectangle1.isAttacking)
}

function detectCollioson() {
  if (retangularColli({ rectangle1: mainPlayer, rectangle2: enemy })) {
    mainPlayer.isAttacking = false;
    enemy.health -= 13;
    enemy.refHealth.style.width = `${enemy.health}%`;
    if (enemy && mainPlayer) {
      socket.emit("PlayerAttack", { enemy, room });
    }
    if (Players[1].health == 0) {

    }
  } else if (retangularColli({ rectangle1: enemy, rectangle2: mainPlayer })) {
    enemy.isAttacking = false;
    mainPlayer.health -= 13;
    mainPlayer.refHealth.style.width = `${mainPlayer.health}%`;
    if (enemy && mainPlayer) {
      socket.emit("PlayerAttack", { enemy, room });
    }
  }
}

function checkWin() {
  if (mainPlayer.health === enemy.health) {

  } else if (enemy.health === 0) {

  } else if (mainPlayer.health === 0) {

  }
}

function animate() {

  window.requestAnimationFrame(animate);

  c.fillStyle = "white";
  c.fillRect(0, 0, can.width, can.height);
  if (Players.length > 0) {
    mainPlayer.update();
  }
  if (Players.length > 1) {
    enemy.update();
    detectCollioson();
  }

}



window.addEventListener("keydown", (event) => {


  switch (event.key.toLowerCase()) {
    case 'd':
      mainPlayer.keys.d.pressed = true;
      mainPlayer.keys.lastKey = 'd';
      break;
    case 'a':
      mainPlayer.keys.a.pressed = true;
      mainPlayer.keys.lastKey = 'a';
      break;
    case 'w':
      mainPlayer.keys.w.pressed = true;
      break;
    case 's':
      mainPlayer.keys.a.pressed = true;
      mainPlayer.keys.lastKey = 'a';
      break;
    case ' ':
      mainPlayer.attack(2)
      break;
  }

  if (enemy && mainPlayer) {
    socket.emit("PlayerUpdate", { mainPlayer, room });
  }
});

window.addEventListener("mousedown", (event) => {

  console.log(event);
  switch (event.buttons) {
    case 1:
      mainPlayer.attack(1)
      break;
    case 2:
      mainPlayer.block()
      break;
  }
  if (enemy && mainPlayer) {
    socket.emit("PlayerUpdate", { mainPlayer, room });
  }
});
window.addEventListener("keyup", (event) => {
  switch (event.key.toLowerCase()) {
    case 'd':
      mainPlayer.keys.d.pressed = false;
      break;
    case 'a':
      mainPlayer.keys.a.pressed = false;
      break;
    case 'w':
      mainPlayer.keys.w.pressed = false;
      break;
    case 's':
      mainPlayer.keys.a.pressed = false;
      break;
  }

  if (enemy && mainPlayer) {
    socket.emit("PlayerUpdate", { mainPlayer, room });
  }
});


animate();