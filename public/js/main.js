const loadingDots = document.getElementsByClassName("loading-dots");
const loadingBox = document.getElementsByClassName("loading-box");
const logoHolder = document.getElementsByTagName('audio');

const menu = document.getElementsByClassName('button-sound')
const beepOm = document.getElementById('beep');

let loading = true;

// window.addEventListener("load", (event) => {
  
//   let load;
//   if(loading) {
//     setTimeout(() => {loading = false;
//       clearInterval(load);
//       loadingBox[0].classList.remove('show-loading');
//       logoHolder[0].classList.remove('top-space');
//     }, 5000);

//     let i = 1;
//     load = setInterval(() => {
//       if(i == 1) {
//         loadingDots[0].innerHTML = "*"
//       } else if (i == 2) {
//         loadingDots[0].innerHTML = "**"
//       } else if (i == 3) {
//         loadingDots[0].innerHTML = "***"
//       } else {
//         loadingDots[0].innerHTML = ""
//         i = 0;
//       }

//       i++;
//     }, 300);
//   }
// });

var audio = document.createElement("AUDIO")
document.body.appendChild(audio);
audio.src = "./hover.mp3";

console.log(audio.play());


menu[0].addEventListener("mouseenter", e => {
  console.log(logoHolder[0].play());
})