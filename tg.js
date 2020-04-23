const cement = document.getElementById("cement");
const ctx = cement.getContext("2d");

const nextWindow = document.getElementById("nextPiece");
const nextCtx = nextWindow.getContext("2d");

const tetrad = document.getElementById("tetradContainer");

const block1 = document.getElementById("block1");
const block2 = document.getElementById("block2");

const block3 = document.getElementById("block3");
const block4 = document.getElementById("block4");

const tetradBlocks = [block1, block2, block3, block4];

let cementedBlocks = [];

const blockSize = 25;

const tetrimino = {// L piece is purple, I piece red, T piece yellow, S piece green, Z piece cyan, O piece blue and J piece white 
  I: {
    rotation0: [[25, 0],[25, 25],[25, 50],[25, 75]],
    rotation1: [[75, 50],[50, 50],[25, 50],[0,50]],
    color: "red"
  },
  T: {
    rotation0: [[0, 25],[50, 25],[25, 25],[25, 50]],
    rotation1: [[0, 25],[25, 0],[25, 25],[25, 50]],
    rotation2: [[0, 25],[50, 25],[25, 25],[25, 0]],
    rotation3: [[25, 50],[50, 25],[25, 25],[25, 0]],
    color: "yellow"
  },
  Z: {
    rotation0: [[0, 0],[25, 0],[25, 25],[50, 25]],
    rotation1: [[50, 0],[50, 25],[25, 25],[25, 50]],
    color: "cyan"
  },
  S: {
    rotation0: [[50, 0],[25, 0],[25, 25],[0, 25]],
    rotation1: [[0, 0],[0, 25],[25, 25],[25, 50]],
    color: "green"
  },
  J: {
    rotation0: [[50, 0],[50, 50],[50, 25],[25, 50]],
    rotation1: [[75, 25],[25, 25],[50, 25],[25, 0]],
    rotation2: [[50, 50],[50, 0],[50, 25],[75, 0]],
    rotation3: [[25, 25],[75,25],[50,25],[75, 50]],
    color: "white"
  },
  L: {
    rotation0: [[25, 0],[25, 50],[25, 25],[50,50]],
    rotation1: [[50, 25],[0, 25],[25, 25],[0, 50]],
    rotation2: [[25, 50],[25, 0],[25, 25],[0, 0]],
    rotation3: [[0, 25],[50, 25],[25, 25],[50, 0]],
    color: "purple"
  },
  O: {
    rotation0: [[25, 0],[25, 25],[50, 0],[50, 25]],
    color: "blue"
  }
}
let paused = false;

let score = 0;
document.getElementById("score").innerHTML = score.toString().padStart(12, '0');
let lineCounter = 0;
let dropSpeed = 1000;

let nextPiece = undefined;
let currentPiece = undefined;

tetrad.style.top = "-25px";

function newGame() {
  paused = false;
  cementedBlocks = [];
  score = 0;
  document.getElementById("score").innerHTML = score.toString().padStart(12, '0');
  ctx.clearRect(0, 0, 250, 500);
  dropPiece(pieceRandomizer());
  nextPieceSelection(pieceRandomizer());
  tetrad.style.top = "-100px";
  init();
}

function init() {
  if(stillFalling()){
    tetrad.style.top = parseInt(tetrad.style.top, 10) + blockSize + "px";
  }

  if (stillFalling()) {
    if (paused === false) {
    setTimeout(init, dropSpeed);
    }
  } else {  
    setTimeout(() => {
      if (!stillFalling()) {
        if (tetrad.style.top === '-100px') {
          gameOver();
        } else {
          for (let i = 0; i < 4; i++) {
            const x = tetrad.offsetLeft + tetradBlocks[i].offsetLeft;
            const y = tetrad.offsetTop + tetradBlocks[i].offsetTop;
            const color = tetrimino[currentPiece].color;

            cementedBlocks.push([x, y, color]);

            drawBlock(x, y, color);
          }
          const level = 1000 - dropSpeed + 25 / 25;
          scoreIncrease(lineChecker(), level);
          document.getElementById("score").innerHTML = score.toString().padStart(12, '0');;
          clearFilledLines(lineChecker());
          tetrad.style.top = "-100px";
          dropPiece(nextPiece);
          nextPieceSelection(pieceRandomizer());
          speedLevelUp();
          init();
        }
      } else {init()}
    }, 500);
  }
}

function speedLevelUp() {
  if (dropSpeed > 200) {
    if (lineCounter >= 10) {
      dropSpeed -= 25;
      lineCounter -= 10;
    }
  }
}

function gameOver() {
  for (let i = 475, delay = 300; i >= 0; i -= 25, delay += 300) {
    setTimeout(() => {
      ctx.fillStyle = "red";
      ctx.fillRect(0 , i, 250, 25);
    }, delay);
    setTimeout(() => {
      ctx.fillStyle = "blue";
      ctx.font = "35px Bold";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", 125, 200)
    }, 5700);
    setTimeout(() => {
      ctx.fillStyle = "green";
      ctx.font = "20px Bold";
      ctx.fillText("~YOUR SCORE~", 125, 250);
      ctx.fillStyle = "gold";
      ctx.font = "35px Bold";
      ctx.fillText(score, 125, 300)
    }, 8000);
  }
}

function scoreIncrease(filledLines, level){
  const lines = filledLines.length;
  let addToScore = 0;
  if (lines === 1) {
    addToScore = 20;
  } else if (lines === 2) {
    addToScore = 45;
  } else if (lines === 3) {
    addToScore = 75;
  } else if (lines === 4) {
    addToScore = 100;
  };
  score += (addToScore * level);
}

function drawBlock(x, y, color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(x + 1, y + 1, 23, 23);  
  ctx.strokeStyle = "gold";
  ctx.strokeRect(x, y, 24, 24);
}

function clearFilledLines(filledLines) {
  for (let i = 0; i < filledLines.length; i++) {
    filledLines.forEach(currentLine => {
      ctx.fillStyle = "gold";
      ctx.fillRect(0 , currentLine, 250, 25);
    });
    cementedBlocks = cementedBlocks.filter(currentBlock => currentBlock[1] !== filledLines[i]); console.log(JSON.stringify(cementedBlocks));
  }
  for (let i = 0, count = 0; i < cementedBlocks.length; i++, count = 0){
    filledLines.forEach(currentLine => {
      if (cementedBlocks[i][1] < currentLine) count++;
    });
    cementedBlocks[i][1] += (25 * count); 
    }

                           setTimeout(() => {
      ctx.clearRect(0, 0, 250, 500);
      for (let i = 0; i < cementedBlocks.length; i++) {
        drawBlock(cementedBlocks[i][0], cementedBlocks[i][1], cementedBlocks[i][2]);
      }
    }, 100);
  }

function lineChecker() {
  let filledLines = [];
  const checkLineHeight = [];
  for (let i = 0; i < 4; i++) {
    const blockHeight = tetradBlocks[i].offsetTop + tetrad.offsetTop;
    if (!checkLineHeight.some((height) => height === blockHeight)) checkLineHeight.push(blockHeight);
  }
  for (let i = 0, count = 0;i < checkLineHeight.length; i++) {
    cementedBlocks.forEach(currentBlock => {if (checkLineHeight[i] === currentBlock[1]) count++});
    if (count === 10) filledLines.push(checkLineHeight[i]);
    count = 0;
  }
  lineCounter += filledLines.length;
  return filledLines;
}

// collisions
function stillFalling() {
  for (let i = 0; i < 4; i++) {
    const x = tetrad.offsetLeft + tetradBlocks[i].offsetLeft;
    const y = tetrad.offsetTop + tetradBlocks[i].offsetTop;
    
    if (y === 475) return false;
    for (let j = 0; j < cementedBlocks.length; j++) {
      if (cementedBlocks[j][0] === x && cementedBlocks[j][1] === y + 25) return false;
    }
  } 
  return true;
}

function sideCollisions() {
  for (let i = 0; i < 4; i++) {
    const x = tetrad.offsetLeft + tetradBlocks[i].offsetLeft;
    const y = tetrad.offsetTop + tetradBlocks[i].offsetTop;
    if (x === 0) return 'left-collision';
    if (x === 225) return 'right-collision';
    for (let j = 0; j < cementedBlocks.length; j++) {
      if (cementedBlocks[j][0] === x + 25 && cementedBlocks[j][1] === y) return 'right-collision';
      if (cementedBlocks[j][0] === x - 25 && cementedBlocks[j][1] === y) return 'left-collision';
    }
  } 
}

function rotationCollision() {
  if (currentPiece === 'I' || currentPiece === 'Z' || currentPiece === 'S') {
    if (timesRotated === 0) {
      for (let i = 0; i < 4; i++) {
        const newX = tetrimino[currentPiece].rotation1[i][0] + tetrad.offsetLeft;
        const newY = tetrimino[currentPiece].rotation1[i][1] + tetrad.offsetTop;
        for (let j = 0; j < cementedBlocks.length; j++) {
          if (cementedBlocks[j][0] === newX && cementedBlocks[j][1] === newY) return true;
        }
      }
    } else {
      for (let i = 0; i < 4; i++) {
        const newX = tetrimino[currentPiece].rotation0[i][0] + tetrad.offsetLeft;
        const newY = tetrimino[currentPiece].rotation0[i][1] + tetrad.offsetTop;
        for (let j = 0; j < cementedBlocks.length; j++) {
          if (cementedBlocks[j][0] === newX && cementedBlocks[j][1] === newY) return true;
        }
      }
    }
  } else {
    if (timesRotated === 0) {
      for (let i = 0; i < 4; i++) {
        const newX = tetrimino[currentPiece].rotation1[i][0] + tetrad.offsetLeft;
        const newY = tetrimino[currentPiece].rotation1[i][1] + tetrad.offsetTop;
        for (let j = 0; j < cementedBlocks.length; j++) {
          if (cementedBlocks[j][0] === newX && cementedBlocks[j][1] === newY) return true;
        }
      }
    } else if (timesRotated === 1) {
      for (let i = 0; i < 4; i++) {
        const newX = tetrimino[currentPiece].rotation2[i][0] + tetrad.offsetLeft;
        const newY = tetrimino[currentPiece].rotation2[i][1] + tetrad.offsetTop;
        for (let j = 0; j < cementedBlocks.length; j++) {
          if (cementedBlocks[j][0] === newX && cementedBlocks[j][1] === newY) return true;
        }
      }
    } else if (timesRotated === 2) {
      for (let i = 0; i < 4; i++) {
        const newX = tetrimino[currentPiece].rotation3[i][0] + tetrad.offsetLeft;
        const newY = tetrimino[currentPiece].rotation3[i][1] + tetrad.offsetTop;
        for (let j = 0; j < cementedBlocks.length; j++) {
          if (cementedBlocks[j][0] === newX && cementedBlocks[j][1] === newY) return 'coll';
        }
      }
    } else {
      for (let i = 0; i < 4; i++) {
        const newX = tetrimino[currentPiece].rotation0[i][0] + tetrad.offsetLeft;
        const newY = tetrimino[currentPiece].rotation0[i][1] + tetrad.offsetTop;
        for (let j = 0; j < cementedBlocks.length; j++) {
          if (cementedBlocks[j][0] === newX && cementedBlocks[j][1] === newY) return true;
        }
      }
    }
  }
  return false;
}

function kickbacks() {
  const x = tetrad.offsetLeft + block3.offsetLeft;
  const y = tetrad.offsetTop + block3.offsetTop;
  if (x === 0) tetrad.style.left = parseInt(tetrad.style.left, 10) + blockSize + "px";
  if (currentPiece === 'I') {
    if (x === 225) tetrad.style.left = parseInt(tetrad.style.left, 10) - 50 + "px";
    if (x === 200) tetrad.style.left = parseInt(tetrad.style.left, 10) - blockSize + "px";
  } else {
    if (x === 225) tetrad.style.left = parseInt(tetrad.style.left, 10) - blockSize + "px";
  }
}

function pieceRandomizer() {
  const possiblePieces = ['I', 'T', 'Z', 'S', 'J', 'L', 'O'];
  nextPiece = possiblePieces[Math.floor(Math.random() * (6 - 0 + 1) ) + 0];
  return nextPiece;
}

function nextPieceSelection(nextPiece) {
  nextCtx.clearRect(0, 0, 100, 100);
  for (let i = 0;i < 4; i++) {
    let x = tetrimino[nextPiece].rotation0[i][0];
    let y = tetrimino[nextPiece].rotation0[i][1];
    nextCtx.beginPath();
    nextCtx.fillStyle = tetrimino[nextPiece].color;
    nextCtx.fillRect(x + 1, y + 1, 23, 23);  
    nextCtx.strokeStyle = "gold";
    nextCtx.strokeRect(x, y, 24, 24);
  }
  return nextPiece;
}

function dropPiece(nextPiece) {
  let timesRotated = 0;
  tetrad.style.left = "75px";
  for (let i = 0; i < 4; i++) {
    tetradBlocks[i].style.left = tetrimino[nextPiece].rotation0[i][0] + 'px';
    tetradBlocks[i].style.top = tetrimino[nextPiece].rotation0[i][1] + 'px';
    tetradBlocks[i].style.background = tetrimino[nextPiece].color;
  }
  return currentPiece = nextPiece;
}

let timesRotated = 0

document.addEventListener("keydown", () => {
  if (event.key === "ArrowRight") {
    goRight();
  }
});

function goRight() {
  if (sideCollisions() != 'right-collision') {
    tetrad.style.left = parseInt(tetrad.style.left, 10) + blockSize + "px";    
  }
}

document.addEventListener("keydown", () => {
  if (event.key === "ArrowLeft") {
    goLeft();
  }
});

function goLeft() {
  if (sideCollisions() != 'left-collision') {
    tetrad.style.left = parseInt(tetrad.style.left, 10) - blockSize + "px";
  }
}

document.addEventListener("keydown", () => {
  if (event.key === "ArrowDown") {
    goDown();
  }
});

function goDown() {
  if (stillFalling()) {
    tetrad.style.top = parseInt(tetrad.style.top, 10) + blockSize + "px";
  }
}

document.addEventListener("keydown", () => {
  if (event.key === "ArrowUp") {
    rotate();
  }
}) ;

function rotate() {
  if (stillFalling()) {
    if (!rotationCollision()) {
      kickbacks();
      if (currentPiece === 'I' || currentPiece === 'Z' || currentPiece === 'S') {
        if (timesRotated === 0) {
          for (let i = 0; i < 4; i++) {
            tetradBlocks[i].style.left = tetrimino[currentPiece].rotation1[i][0] + 'px';
            tetradBlocks[i].style.top = tetrimino[currentPiece].rotation1[i][1] + 'px';
          }
          timesRotated++;
        } else {
          for (let i = 0; i < 4; i++) {
            tetradBlocks[i].style.left = tetrimino[currentPiece].rotation0[i][0] + 'px';
            tetradBlocks[i].style.top = tetrimino[currentPiece].rotation0[i][1] + 'px';
          }
          timesRotated = 0;
        }
      } else {
        if (timesRotated === 0) {
          for (let i = 0; i < 4; i++) {
            tetradBlocks[i].style.left = tetrimino[currentPiece].rotation1[i][0] + 'px';
            tetradBlocks[i].style.top = tetrimino[currentPiece].rotation1[i][1] + 'px';
          }
          timesRotated++;
        } else if (timesRotated === 1) {
          for (let i = 0; i < 4; i++) {
            tetradBlocks[i].style.left = tetrimino[currentPiece].rotation2[i][0] + 'px';
            tetradBlocks[i].style.top = tetrimino[currentPiece].rotation2[i][1] + 'px';
          }
          timesRotated++;
        } else if (timesRotated === 2) {
          for (let i = 0; i < 4; i++) {
            tetradBlocks[i].style.left = tetrimino[currentPiece].rotation3[i][0] + 'px';
            tetradBlocks[i].style.top = tetrimino[currentPiece].rotation3[i][1] + 'px';
          }
          timesRotated++;
        } else {
          for (let i = 0; i < 4; i++) {
            tetradBlocks[i].style.left = tetrimino[currentPiece].rotation0[i][0] + 'px';
            tetradBlocks[i].style.top = tetrimino[currentPiece].rotation0[i][1] + 'px';
          }
          timesRotated = 0;
        }
      }
    }
  }
}

document.addEventListener("keydown", () => {
  if (event.keyCode === 78) newGame(); start();
})

document.addEventListener("keydown", () => {
  if (event.keyCode === 80) togglePause(); pause();
});

function togglePause() {
  if (!paused) {
    paused = true;
  } else if (paused) {
    paused= false;
    init();
  }
}
// gameOver();
// console.log(nextPeiceSelection())
// init();