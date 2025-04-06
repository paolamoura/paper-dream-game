document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
  
    const btn = document.getElementById("btn-comecar");
    const tela = document.getElementById("tela-instrucoes");
    const musicaFase = document.getElementById("musica-inseguranca");
    const somTremor = document.getElementById("efeito-tremor");
    const somVitoria = document.getElementById("efeito-vitoria");
  
    btn.addEventListener("click", () => {
      tela.classList.add("hidden");
      canvas.classList.remove("hidden");
      musicaFase.volume = 0.4;
      musicaFase.play();
      loop();
    });
  
    const personagemImg = new Image();
    personagemImg.src = "../assets/personagem.png";
  
    const blocoImg = new Image();
    blocoImg.src = "../assets/img/bloco-papel.png";
  
    const fundoImg = new Image();
    fundoImg.src = "../assets/img/fundo-canvas2.jpg";
  
    const alvoImg = new Image();
    alvoImg.src = "../assets/img/alvo.png";
  
    const player = { x: 100, y: 100, width: 96, height: 96, speed: 3 };
  
    const goal = { x: 620, y: 460, width: 160, height: 160 };
  
    const blocos = [
      { x: 300, y: 300, width: 160, height: 110, text: "incapaz", dx: 0, dy: 0 },
      { x: 500, y: 200, width: 160, height: 110, text: "ansiedade", dx: 0, dy: 0 },
      { x: 200, y: 450, width: 160, height: 110, text: "autocrítica", dx: 0, dy: 0 }
    ];
  
    const confetes = [];
    for (let i = 0; i < 50; i++) {
      confetes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 1 + 0.5,
        size: Math.random() * 3 + 2
      });
    }
  
    const keys = {};
    document.addEventListener("keydown", e => keys[e.key] = true);
    document.addEventListener("keyup", e => keys[e.key] = false);
  
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
  
      const futuro = { x: nextX, y: nextY, width: player.width, height: player.height };
  
      let encostou = false;
  
      blocos.forEach(bloco => {
        if (isColliding(futuro, bloco)) {
          encostou = true;
          bloco.dx = (bloco.x - player.x) * 0.1;
          bloco.dy = (bloco.y - player.y) * 0.1;
          somTremor.currentTime = 0;
          somTremor.play();
        }
      });
  
      if (!encostou) {
        player.x = nextX;
        player.y = nextY;
      }
    }
  
    function updateBlocos() {
      blocos.forEach(b => {
        b.x += b.dx;
        b.y += b.dy;
  
        if (b.x < 0 || b.x + b.width > canvas.width) b.dx *= -1;
        if (b.y < 0 || b.y + b.height > canvas.height) b.dy *= -1;
  
        b.dx *= 0.9;
        b.dy *= 0.9;
      });
    }
  
    function drawFundo() {
      ctx.drawImage(fundoImg, 0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(180,100,255,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      confetes.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(180,100,255,0.5)";
        ctx.fill();
        c.y += c.speed;
        if (c.y > canvas.height) {
          c.y = -10;
          c.x = Math.random() * canvas.width;
        }
      });
    }
  
    function drawGoal() {
      const time = Date.now() / 300;
      const pulse = Math.sin(time) * 20 + 80;
      const x = goal.x + goal.width / 2;
      const y = goal.y + goal.height / 2;
  
      const grad = ctx.createRadialGradient(x, y, 10, x, y, pulse);
      grad.addColorStop(0, "rgba(180, 100, 255, 0.4)");
      grad.addColorStop(1, "rgba(180, 100, 255, 0)");
  
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, pulse, 0, Math.PI * 2);
      ctx.fill();
  
      ctx.drawImage(alvoImg, goal.x, goal.y, goal.width, goal.height);
    }
  
    function drawPlayer() {
      const x = player.x + player.width / 2;
      const y = player.y + player.height / 2;
      const radius = 100;
  
      const grad = ctx.createRadialGradient(x, y, radius * 0.3, x, y, radius);
      grad.addColorStop(0, "rgba(180, 100, 255, 0.5)");
      grad.addColorStop(1, "rgba(180, 100, 255, 0)");
  
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
  
      ctx.drawImage(personagemImg, player.x, player.y, player.width, player.height);
    }
  
    function drawBlocos() {
      blocos.forEach(bloco => {
        const vibraX = Math.sin(Date.now() / 100 + bloco.x) * 2;
        const vibraY = Math.cos(Date.now() / 130 + bloco.y) * 2;
        const posX = bloco.x + vibraX;
        const posY = bloco.y + vibraY;
  
        ctx.drawImage(blocoImg, posX, posY, bloco.width, bloco.height);
        ctx.font = "24px 'Just Another Hand', cursive";
        ctx.fillStyle = "#3c2a21";
        ctx.textAlign = "center";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 2;
        ctx.fillText(bloco.text, posX + bloco.width / 2, posY + bloco.height / 2 + 10);
        ctx.shadowBlur = 0;
      });
    }
  
    function checkVictory() {
      return isColliding(player, goal);
    }
  
    let vencido = false;
  
    function mostrarMensagemFinal() {
      ctx.fillStyle = "rgba(0,0,0,0.8)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#fff";
      ctx.font = "28px 'Just Another Hand', cursive";
      ctx.textAlign = "center";
      ctx.fillText("Você enfrentou a insegurança!", canvas.width / 2, canvas.height / 2 - 10);
      ctx.fillText("Continue com coragem ✨", canvas.width / 2, canvas.height / 2 + 30);
    }
  
    function loop() {
      if (vencido) {
        mostrarMensagemFinal();
        return;
      }
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawFundo();
      movePlayer();
      updateBlocos();
      drawGoal();
      drawBlocos();
      drawPlayer();
  
      if (checkVictory()) {
        vencido = true;
        musicaFase.pause();
        somVitoria.play();
      }
  
      requestAnimationFrame(loop);
    }
  });
  