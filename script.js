const tempo = document.querySelector('.tempo');
const btnIniciarOuPausar = document.querySelector('.iniciar');
const btnRestaurarOuMarcar = document.querySelector('.restaurar');
const voltas = document.querySelector('.voltas');
const titulosVoltas = document.querySelector('.titulos-voltas');

let contagem;
let arrayTempo = tempo.innerText.split(':');
let qtdVoltas = 0;

function callback() {
  if (arrayTempo[2] < 99) {
    ++arrayTempo[2];
  } else if (arrayTempo[1] < 59) {
    ++arrayTempo[1];
    arrayTempo[2] = 0;
  } else if (arrayTempo[0] < 59) {
    ++arrayTempo[0];
    arrayTempo[2] = 0;
    arrayTempo[1] = 0;
  }
  // console.log(arrayTempo)
  for (let i = 0; i < arrayTempo.length; i++) {
    if (arrayTempo[i] < 10) {
      arrayTempo[i] = arrayTempo[i].toLocaleString('en-US', {
        minimumIntegerDigits: 2, 
        useGrouping: false
      });
    }
  }
  tempo.innerText = arrayTempo.join(':');
}

function trocarClassBotao(botao, classeAtual, classeNova) {
  botao.classList.remove(classeAtual);
  botao.classList.add(classeNova);
}

function iniciar() {
  contagem = setInterval(callback, 10);
  btnIniciarOuPausar.innerText = 'Pausar';
  btnRestaurarOuMarcar.innerText = 'Volta';
  trocarClassBotao(btnIniciarOuPausar, 'iniciar', 'pausar')
  trocarClassBotao(btnRestaurarOuMarcar, 'restaurar', 'marcar')
  btnRestaurarOuMarcar.removeAttribute("disabled");
}

function pausar() {
  clearInterval(contagem);
  btnIniciarOuPausar.innerText = 'Iniciar';
  btnRestaurarOuMarcar.innerText = 'Restaurar';
  trocarClassBotao(btnIniciarOuPausar, 'pausar', 'iniciar');
  trocarClassBotao(btnRestaurarOuMarcar, 'marcar', 'restaurar');
  btnRestaurarOuMarcar.removeAttribute("disabled");
}

function restaurar() {
  tempo.innerText = '00:00:00';
  arrayTempo = tempo.innerText.split(':');
  btnRestaurarOuMarcar.setAttribute('disabled', '');
  voltas.classList.remove('ativo');
  voltas.innerHTML = titulosVoltas.outerHTML;
  qtdVoltas = 0;
}

function marcarVolta() {
  voltas.classList.add('ativo');
  const volta = document.createElement('tr');
  const numVolta = document.createElement('td');
  numVolta.innerText = ++qtdVoltas;
  const tempoVolta = document.createElement('td');
  tempoVolta.innerText = tempo.innerText;
  const duracaoVolta = document.createElement('td');
  volta.appendChild(numVolta);
  volta.appendChild(tempoVolta);
  if (voltas.children[1]) {
    voltas.insertBefore(volta, voltas.children[1])
  } else {
    voltas.appendChild(volta);
  }
}

btnIniciarOuPausar.addEventListener('click', () => {
 btnIniciarOuPausar.classList.contains('iniciar') ? iniciar() : pausar();
});
btnRestaurarOuMarcar.addEventListener('click', () => {
  btnRestaurarOuMarcar.classList.contains('restaurar') ? restaurar() : marcarVolta();
});