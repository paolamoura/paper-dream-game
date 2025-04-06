if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
    window.location.href = "index.html";
  }  

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
  x: 100, y: 100, width: 125, height: 125, speed: 3, image: new Image()
};
player.image.src = "../assets/personagem.png";

const blocoImg = new Image();
blocoImg.src = '../assets/img/bloco-papel.png';

const fundoImg = new Image();
fundoImg.src = '../assets/img/fundo-canvas3.jpg';

const arvoreImg = new Image();
arvoreImg.src = '../assets/img/arvore.png';

const musicaMenu = document.getElementById("musica-menu");
const somVitoria = document.getElementById("som-vitoria");

const telaInstrucoes = document.getElementById("tela-instrucoes");
const telaParabens = document.getElementById("tela-parabens");
const btn = document.getElementById("btn-comecar");

const blocos = [
  { x: 100, y: 100, width: 160, height: 110, text: "dúvida", positivo: "confiança", tocado: false, dx: 2, dy: 1.5 },
  { x: 300, y: 200, width: 160, height: 110, text: "crítica", positivo: "autoamor", tocado: false, dx: -2, dy: 1.8 },
  { x: 500, y: 300, width: 160, height: 110, text: "pressão", positivo: "leveza", tocado: false, dx: 1.2, dy: -2 },
  { x: 200, y: 400, width: 160, height: 110, text: "medo", positivo: "coragem", tocado: false, dx: 1.8, dy: -1.5 }
];

const goal = { x: 620, y: 460, width: 80, height: 80 };

const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

btn.addEventListener("click", () => {
  telaInstrucoes.classList.add("hidden");
  canvas.classList.remove("hidden");
  musicaMenu.volume = 0.6;
  musicaMenu.play();
  loop();
});

function isColliding(a, b) {
  return !(a.x > b.x + b.width ||
           a.x + a.width < b.x ||
           a.y > b.y + b.height ||
           a.y + a.height < b.y);
}

function movePlayer() {
  let nextX = player.x;
  let nextY = player.y;
  if (keys["ArrowUp"]) nextY -= player.speed;
  if (keys["ArrowDown"]) nextY += player.speed;
  if (keys["ArrowLeft"]) nextX -= player.speed;
  if (keys["ArrowRight"]) nextX += player.speed;
  player.x = nextX;
  player.y = nextY;
}

function moveBlocos() {
  blocos.forEach(b => {
    b.x += b.dx;
    b.y += b.dy;
    if (b.x < 0 || b.x + b.width > canvas.width) b.dx *= -1;
    if (b.y < 0 || b.y + b.height > canvas.height) b.dy *= -1;
  });
}

function draw() {
  ctx.drawImage(fundoImg, 0, 0, canvas.width, canvas.height);

  blocos.forEach(b => {
    if (isColliding(player, b)) b.tocado = true;
    ctx.drawImage(blocoImg, b.x, b.y, b.width, b.height);
    ctx.font = "bold 20px 'Quicksand'";
    ctx.fillStyle = b.tocado ? "#3c7e3c" : "#3c2a21";
    ctx.shadowColor = b.tocado ? "#82ff82" : "#000";
    ctx.shadowBlur = b.tocado ? 10 : 2;
    ctx.textAlign = "center";
    ctx.fillText(b.tocado ? b.positivo : b.text, b.x + b.width / 2, b.y + b.height / 2 + 10);
    ctx.shadowBlur = 0;
  });

  const x = player.x + player.width / 2;
  const y = player.y + player.height / 2;
  const radius = 90;
  const grad = ctx.createRadialGradient(x, y, 30, x, y, radius);
  grad.addColorStop(0, "rgba(144,238,144,0.5)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.drawImage(player.image, player.x, player.y, player.width, player.height);

  if (blocos.every(b => b.tocado)) {
    const gx = goal.x + goal.width / 2;
    const gy = goal.y + goal.height / 2;
    const pulse = Math.sin(Date.now() / 300) * 20 + 60;
    const ggrad = ctx.createRadialGradient(gx, gy, 10, gx, gy, pulse);
    ggrad.addColorStop(0, "rgba(144,238,144,0.4)");
    ggrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = ggrad;
    ctx.beginPath();
    ctx.arc(gx, gy, pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(arvoreImg, goal.x, goal.y, goal.width, goal.height);
  }
}

let vencido = false;

const confCanvas = document.getElementById("confetesCanvas");
const confCtx = confCanvas.getContext("2d");
const confetes = [];

function criarConfetes() {
  for (let i = 0; i < 80; i++) {
    confetes.push({
      x: Math.random() * confCanvas.width,
      y: Math.random() * confCanvas.height,
      speedY: Math.random() * 2 + 1,
      size: Math.random() * 6 + 3,
      color: `hsl(${Math.random() * 360}, 80%, 60%)`
    });
  }
}

function desenharConfetes() {
  confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
  confetes.forEach(c => {
    confCtx.beginPath();
    confCtx.arc(c.x, c.y, c.size, 0, 2 * Math.PI);
    confCtx.fillStyle = c.color;
    confCtx.fill();
    c.y += c.speedY;
    if (c.y > confCanvas.height) {
      c.y = -10;
      c.x = Math.random() * confCanvas.width;
    }
  });
  requestAnimationFrame(desenharConfetes);
}


function loop() {
  if (vencido) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  movePlayer();
  moveBlocos();
  draw();

  if (blocos.every(b => b.tocado) && isColliding(player, goal)) {
    vencido = true;
    musicaMenu.pause();
    somVitoria.play();
    canvas.classList.add("hidden");
    telaParabens.classList.remove("hidden");
    criarConfetes();
    desenharConfetes();
  }  

  requestAnimationFrame(loop);
}

window.addEventListener("load", () => {
    setTimeout(() => {
      musicaMenu.volume = 0.6;
      musicaMenu.play().catch(() => {});
    }, 300);
  });
  