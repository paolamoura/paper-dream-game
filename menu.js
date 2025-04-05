document.addEventListener("DOMContentLoaded", () => {
    const btnIniciar = document.getElementById('btn-iniciar');
    const btnContinuar = document.getElementById('btn-continuar');
    const telaInicial = document.getElementById('tela-inicial');
    const telaInstrucoes = document.getElementById('tela-instrucoes');
    const avisoFase = document.getElementById('aviso-fase');
    const canvas = document.getElementById('gameCanvas');
  
    btnIniciar.addEventListener('click', () => {
      telaInicial.style.display = "none";
      telaInstrucoes.style.display = "flex";
    });
  
    btnContinuar.addEventListener('click', () => {
      telaInstrucoes.style.display = "none";
      avisoFase.style.display = "block";
      canvas.style.display = "block";
  
      setTimeout(() => {
        avisoFase.style.display = "none";
        startGame(); 
      }, 2500);
    });
  });
  