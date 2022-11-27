const code = document.getElementById('random-hold');
let x = Math.floor((Math.random() * 100000000) + 1000000);
code.value = x;