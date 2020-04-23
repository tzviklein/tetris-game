const speaker = document.getElementById("speaker");

speaker.innerHTML = "&#128265;"

const player = new Audio("Tetris-Gameboy-Type-A.mp3"); 

player.loop=true;

function SetVolume(val) {
  player.volume = val / 100;
  if(val != 0){
    if(val > 74){
      speaker.innerHTML = "&#128266;"
    }else if(val < 25){
      speaker.innerHTML = "&#128264;"
    }else{
      speaker.innerHTML = "&#128265;"
    }
  }else{
    speaker.innerHTML = "&#128263;"
  }
}

function sliderPopout() {
  document.getElementById("slider").style.display = "initial";
}

function sliderVanish() {
  document.getElementById("slider").style.display = "none";
}

function start() {
    player.play()
}

  function pause() {
      if(paused){
          player.pause();
      }else{
          player.play();
      }
      
  }