const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const somAmbiente = new Audio("./assets/audio/ambiente.mp3");
const somVitoria = new Audio("./assets/audio/vitoria.mp3");
somAmbiente.loop = true;
somAmbiente.volume = 0.4;

const player = {
  x: 50,
  y: 50,
  width: 96,
  height: 96,
  speed: 3,
  image: new Image()
};
player.image.src = "./assets/personagem.png";

const blocoImg = new Image();
blocoImg.src = './assets/img/bloco-papel.png';

const goal = { x: 700, y: 500, width: 64, height: 64 };
const goalImg = new Image();
goalImg.src = './assets/img/estrela.png';

const fundoImg = new Image();
fundoImg.src = './assets/img/fundo-canvas.jpg'; 

const keys = {};
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

const empurraveis = [
  { x: 200, y: 150, width: 160, height: 110, text: "não sou capaz" },
  { x: 400, y: 250, width: 160, height: 110, text: "fracasso" },
  { x: 500, y: 400, width: 160, height: 110, text: "insegurança" }
];

const particulas = [];

function criarParticula() {
  particulas.push({
    x: player.x + player.width / 2 + (Math.random() * 40 - 20),
    y: player.y + player.height / 2 + (Math.random() * 40 - 20),
    size: Math.random() * 3 + 1,
    opacity: 1,
    speedY: Math.random() * -1 - 0.5
  });
}

function atualizarParticulas() {
  for (let p of particulas) {
    p.y += p.speedY;
    p.opacity -= 0.01;
  }
  for (let i = particulas.length - 1; i >= 0; i--) {
    if (particulas[i].opacity <= 0) {
      particulas.splice(i, 1);
    }
  }
}

function movePlayer() {
  let nextX = player.x;
  let nextY = player.y;

  if (keys["ArrowUp"]) nextY -= player.speed;
  if (keys["ArrowDown"]) nextY += player.speed;
  if (keys["ArrowLeft"]) nextX -= player.speed;
  if (keys["ArrowRight"]) nextX += player.speed;

  const futurePlayer = {
    x: nextX,
    y: nextY,
    width: player.width,
    height: player.height
  };

  let colidiu = false;

  for (let bloc of empurraveis) {
    if (isColliding(futurePlayer, bloc)) {
      colidiu = true;
      const deltaX = nextX - player.x;
      const deltaY = nextY - player.y;
      bloc.x += deltaX;
      bloc.y += deltaY;
    }
  }

  if (!colidiu) {
    player.x = nextX;
    player.y = nextY;
  }
}

function isColliding(r1, r2) {
  return !(
    r1.x > r2.x + r2.width ||
    r1.x + r1.width < r2.x ||
    r1.y > r2.y + r2.height ||
    r1.y + r1.height < r2.y
  );
}

function drawFundoCanvas() {
  ctx.drawImage(fundoImg, 0, 0, canvas.width, canvas.height);
}

function drawDarkness() {
  const x = player.x + player.width / 2;
  const y = player.y + player.height / 2;
  const radius = 100;

  const grad = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius);
  grad.addColorStop(0, "rgba(255, 255, 200, 0.3)");
  grad.addColorStop(0.6, "rgba(255, 255, 150, 0.05)");
  grad.addColorStop(1, "rgba(0,0,0,1)");

  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}

function drawEmpurraveis() {
  for (let bloc of empurraveis) {
    ctx.drawImage(blocoImg, bloc.x, bloc.y, bloc.width, bloc.height);
    ctx.font = "28px 'Just Another Hand', cursive";
    ctx.fillStyle = "#3c2a21";
    ctx.textAlign = "center";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 2;
    ctx.fillText(bloc.text, bloc.x + bloc.width / 2, bloc.y + bloc.height / 2 + 10);
    ctx.shadowBlur = 0;
    ctx.textAlign = "start";
  }
}

function drawGoal() {
  ctx.drawImage(goalImg, goal.x, goal.y, goal.width, goal.height);
}

function drawPlayer() {
  ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

function drawParticulas() {
  for (let p of particulas) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 223, 100, ${p.opacity})`;
    ctx.fill();
  }
}

let faseConcluida = false;

function mostrarMensagemFinal() {
  ctx.fillStyle = "rgba(0,0,0,0.8)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "28px 'Just Another Hand', cursive";
  ctx.textAlign = "center";
  ctx.fillText("Você enfrentou a escuridão.", canvas.width / 2, canvas.height / 2 - 20);
  ctx.fillText("A luz estava em você o tempo todo. ✨", canvas.width / 2, canvas.height / 2 + 20);
}

function gameLoop() {
  if (faseConcluida) {
    mostrarMensagemFinal();
    return;
  }

  movePlayer();
  criarParticula();
  atualizarParticulas();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawFundoCanvas();
  drawDarkness();
  drawEmpurraveis();
  drawGoal();
  drawParticulas();
  drawPlayer();

  if (isColliding(player, goal)) {
    faseConcluida = true;
    somVitoria.play();
    somAmbiente.pause();
  }

  requestAnimationFrame(gameLoop);
}

window.startGame = function () {
  somAmbiente.play();
  gameLoop();
};
