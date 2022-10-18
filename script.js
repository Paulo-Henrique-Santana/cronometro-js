const tempo = document.querySelector('.tempo');
const btnIniciarOuPausar = document.querySelector('.iniciar');
const btnRestaurarOuMarcar = document.querySelector('.restaurar');
const voltas = document.querySelector('.voltas');
const titulosVoltas = document.querySelector('.titulos-voltas');

let contagem;
let arrayTempo = tempo.innerText.split(':');
let qtdVoltas = 0;

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

function iniciar() {
  contagem = setInterval(iniciarTempo, 10);
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
  const numVolta = document.createElement('td');
  numVolta.innerText = ++qtdVoltas;
  const duracaoVolta = document.createElement('td');
  duracaoVolta.innerText = calcularDuracaoVolta();
  const tempoVolta = document.createElement('td');
  tempoVolta.innerText = tempo.innerText;
  tempoVolta.classList.add('tempo-volta');
  const volta = document.createElement('tr');
  volta.appendChild(numVolta);
  volta.appendChild(duracaoVolta);
  volta.appendChild(tempoVolta);
  if (voltas.children[1]) {
    voltas.insertBefore(volta, voltas.children[1])
  } else {
    voltas.appendChild(volta);
  }
}

function calcularDuracaoVolta() {
  if (voltas.children[1]) {
    const ultimaVolta = voltas.querySelector('tr:nth-child(2) .tempo-volta').innerText.split(':');
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
      console.log('1')

    } else {
      duracaoVolta.push(+arrayTempo[2] - +ultimaVolta[2]);
      console.log('2')

    }

    console.log(arrayTempo, ultimaVolta)
    console.log(duracaoVolta)
    return addZeroAEsquerda(duracaoVolta).join(':');
  } else {
    return tempo.innerText;
  }
}

btnIniciarOuPausar.addEventListener('click', () => {
 btnIniciarOuPausar.classList.contains('iniciar') ? iniciar() : pausar();
});
btnRestaurarOuMarcar.addEventListener('click', () => {
  btnRestaurarOuMarcar.classList.contains('restaurar') ? restaurar() : marcarVolta();
});