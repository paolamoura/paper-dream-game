const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const somVitoria = new Audio("./assets/audio/vitoria.mp3");

const player = {
  x: 50, y: 50, width: 96, height: 96, speed: 3, image: new Image()
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
  particulas.forEach(p => {
    p.y += p.speedY;
    p.opacity -= 0.01;
  });
  for (let i = particulas.length - 1; i >= 0; i--) {
    if (particulas[i].opacity <= 0) particulas.splice(i, 1);
  }
}

function isColliding(a, b) {
  return !(a.x > b.x + b.width || a.x + a.width < b.x || a.y > b.y + b.height || a.y + a.height < b.y);
}

function movePlayer() {
  let nextX = player.x;
  let nextY = player.y;

  if (keys["ArrowUp"]) nextY -= player.speed;
  if (keys["ArrowDown"]) nextY += player.speed;
  if (keys["ArrowLeft"]) nextX -= player.speed;
  if (keys["ArrowRight"]) nextX += player.speed;

  const futurePlayer = { x: nextX, y: nextY, width: player.width, height: player.height };
  let colidiu = false;

  empurraveis.forEach(bloc => {
    if (isColliding(futurePlayer, bloc)) {
      colidiu = true;
      const deltaX = nextX - player.x;
      const deltaY = nextY - player.y;
      bloc.x += deltaX;
      bloc.y += deltaY;
    }
  });

  if (!colidiu) {
    player.x = nextX;
    player.y = nextY;
  }
}

function drawFundoCanvas() {
  ctx.drawImage(fundoImg, 0, 0, canvas.width, canvas.height);
}

function drawLuzDourada() {
  const x = player.x + player.width / 2;
  const y = player.y + player.height / 2;
  const radius = 120;

  const grad = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius);
  grad.addColorStop(0, "rgba(255, 255, 160, 0.8)");
  grad.addColorStop(0.5, "rgba(255, 223, 100, 0.3)");
  grad.addColorStop(1, "rgba(255, 255, 200, 0)");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawEmpurraveis() {
  empurraveis.forEach(bloc => {
    ctx.drawImage(blocoImg, bloc.x, bloc.y, bloc.width, bloc.height);
    ctx.font = "20px 'Signika Negative', sans-serif";
    ctx.fillStyle = "#3c2a21";
    ctx.textAlign = "center";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 2;
    ctx.fillText(bloc.text, bloc.x + bloc.width / 2, bloc.y + bloc.height / 2 + 10);
    ctx.shadowBlur = 0;
  });
}

function drawGoal() {
  ctx.drawImage(goalImg, goal.x, goal.y, goal.width, goal.height);
}

function drawPlayer() {
  ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

function drawParticulas() {
  particulas.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 223, 100, ${p.opacity})`;
    ctx.fill();
  });
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
  drawLuzDourada();
  drawEmpurraveis();
  drawGoal();
  drawParticulas();
  drawPlayer();

  if (isColliding(player, goal)) {
    faseConcluida = true;
    somVitoria.play();
    document.getElementById("musica-fase").pause();
  
    setTimeout(() => {
      window.location.href = "./phase-two/phase-two.html";
    }, 2000);
  }  

  requestAnimationFrame(gameLoop);
}

window.startGame = function () {
  gameLoop();
};
