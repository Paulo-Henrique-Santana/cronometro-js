const tempo = document.querySelector('.tempo');
const btnIniciarOuPausar = document.querySelector('.iniciar');
const btnRestaurarOuMarcar = document.querySelector('.restaurar');
const voltas = document.querySelector('.voltas');
const titulosVoltas = document.querySelector('.titulos-voltas');

let contagem;
let qtdVoltas = 0;
let arrayVoltas = [];
carregarDados();
let arrayTempo = tempo.innerText.split(':');

function iniciar() {
  contagem = setInterval(iniciarTempo, 10);
  btnIniciarOuPausar.innerText = 'Pausar';
  btnRestaurarOuMarcar.innerText = 'Volta';
  trocarClassBotao(btnIniciarOuPausar, 'iniciar', 'pausar')
  trocarClassBotao(btnRestaurarOuMarcar, 'restaurar', 'marcar')
  btnRestaurarOuMarcar.removeAttribute("disabled");
}

function iniciarTempo() {
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

  tempo.innerText = addZeroAEsquerda(arrayTempo).join(':');
  localStorage.tempo = tempo.innerText;
}

function addZeroAEsquerda(array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] < 10) {
      array[i] = array[i].toLocaleString('en-US', {
        minimumIntegerDigits: 2, 
        useGrouping: false
      });
    }
  }
  return array;
}

function trocarClassBotao(botao, classeAtual, classeNova) {
  botao.classList.remove(classeAtual);
  botao.classList.add(classeNova);
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
  arrayVoltas = [];
  localStorage.clear();
}

function marcarVolta(numero, duracao, hora) {
  voltas.classList.add('ativo');
  const numVolta = document.createElement('td');
  numVolta.innerText = numero;
  numVolta.classList.add('numVolta');
  const duracaoVolta = document.createElement('td');
  duracaoVolta.innerText = duracao;
  duracaoVolta.classList.add('duracaoVolta');
  const horaVolta = document.createElement('td');
  horaVolta.innerText = hora;
  horaVolta.classList.add('horaVolta');
  const volta = document.createElement('tr');
  volta.appendChild(numVolta);
  volta.appendChild(duracaoVolta);
  volta.appendChild(horaVolta);
  if (voltas.children[1]) {
    voltas.insertBefore(volta, voltas.children[1]);
  } else {
    voltas.appendChild(volta);
  }
  salvarVolta(volta);
}

function calcularDuracaoVolta() {
  if (voltas.children[1]) {
    const ultimaVolta = voltas.querySelector('tr:nth-child(2) .horaVolta').innerText.split(':');
    let duracaoVolta = []
    duracaoVolta.push(arrayTempo[0] - ultimaVolta[0]);
    
    if (arrayTempo[1] < ultimaVolta[1]) {
      duracaoVolta.push(arrayTempo[1] - 1);
      duracaoVolta.push(arrayTempo[2])
    } else {
      duracaoVolta.push(arrayTempo[1] - ultimaVolta[1]);
    }
    
    if (arrayTempo[2] < ultimaVolta[2]) {
      --duracaoVolta[1];
      duracaoVolta.push(+arrayTempo[2] + 100 - +ultimaVolta[2]);
    } else {
      duracaoVolta.push(+arrayTempo[2] - +ultimaVolta[2]);
    }
    
    return addZeroAEsquerda(duracaoVolta).join(':');
  } else {
    return tempo.innerText;
  }
}

function salvarVolta(volta) {
  const objVolta = {
    numero: volta.querySelector('.numVolta').innerText,
    duracao: volta.querySelector('.duracaoVolta').innerText,
    hora: volta.querySelector('.horaVolta').innerText
  }
  arrayVoltas.push(objVolta);
  localStorage.voltas = JSON.stringify(arrayVoltas);
}

function carregarDados() {
  if (localStorage.voltas) {  
    const jsonVoltas = JSON.parse(localStorage.voltas);
    jsonVoltas.forEach((objVolta) => {
      marcarVolta(objVolta.numero, objVolta.duracao, objVolta.hora);
    });
    qtdVoltas = jsonVoltas.length;
    btnRestaurarOuMarcar.removeAttribute("disabled");
  }
  if (localStorage.tempo) {
    tempo.innerText = localStorage.tempo;
  }
}

btnIniciarOuPausar.addEventListener('click', () => {
  btnIniciarOuPausar.classList.contains('iniciar') ? iniciar() : pausar();
});
btnRestaurarOuMarcar.addEventListener('click', () => {
  btnRestaurarOuMarcar.classList.contains('restaurar') ? restaurar() : marcarVolta(++qtdVoltas, calcularDuracaoVolta(), tempo.innerText);
});