const formulario = document.getElementById('formulario');
const listaDeTarefas = document.getElementById('tarefas');
const filtro = document.getElementById('filtro');

let tarefas = [];
let edicao = null;

function obterDataAtual() {
  const agora = new Date();
  return agora.toLocaleDateString('pt-BR');
}

function criarTarefa(dadosFormulario) {
  return {
    id: Date.now(),
    titulo: dadosFormulario.titulo,
    dataTarefa: dadosFormulario.dataTarefa,
    comentario: dadosFormulario.comentario,
    prioridade: dadosFormulario.prioridade,
    notificacao: dadosFormulario.notificacao,
    dataCriacao: obterDataAtual()
  };
}

function removerTarefa(id) {
  tarefas = tarefas.filter(tarefa => tarefa.id !== id);
  renderizarTarefas();
}

function preencherFormularioParaEdicao(tarefa) {
  document.getElementById('tituloTarefa').value = tarefa.titulo;
  document.getElementById('dataTarefa').value = tarefa.dataTarefa;
  document.getElementById('comentario').value = tarefa.comentario;
  document.querySelector(`input[name="prioridade"][value="${tarefa.prioridade}"]`).checked = true;
  document.querySelector(`input[name="notificacao"][value="${tarefa.notificacao}"]`).checked = true;

  edicao = tarefa.id;
  formulario.querySelector('input[type="submit"]').value = 'Salvar Edição';
}

function compararDatas(dataA, dataB) {
  const [diaA, mesA, anoA] = dataA.split('/').map(Number);
  const [diaB, mesB, anoB] = dataB.split('/').map(Number);

  const dateA = new Date(anoA, mesA - 1, diaA);
  const dateB = new Date(anoB, mesB - 1, diaB);

  return dateA - dateB;
}

function renderizarTarefas() {
  listaDeTarefas.innerHTML = '';

  if (tarefas.length === 0) {
    listaDeTarefas.innerHTML = '<li class="text-gray-400">Não há tarefas cadastradas</li>';
    return;
  }

  let tarefasOrdenadas = [...tarefas];
  const filtroSelecionado = filtro.value;

  if (filtroSelecionado === 'dataCriacao') {
    tarefasOrdenadas.sort((a, b) => compararDatas(a.dataCriacao, b.dataCriacao));
  }

  if (filtroSelecionado === 'dataTarefa') {
    tarefasOrdenadas.sort((a, b) => compararDatas(a.dataTarefa, b.dataTarefa));
  }

  if (filtroSelecionado === 'prioridade') {
    const ordem = { alta: 1, media: 2, baixa: 3 };
    tarefasOrdenadas.sort((a, b) => ordem[a.prioridade] - ordem[b.prioridade]);
  }

  if (filtroSelecionado === 'alfabetica') {
    tarefasOrdenadas.sort((a, b) => a.titulo.localeCompare(b.titulo));
  }

  tarefasOrdenadas.forEach(tarefa => {
    const li = document.createElement('li');
    li.classList.add('bg-gray-700',
      'p-4', 'rounded-md', 'shadow-sm',
      'flex', 'flex-wrap', 'items-center',
      'justify-between', 'gap-2');

    let corPrioridade = '';
    switch (tarefa.prioridade) {
      case 'baixa':
        corPrioridade = 'text-green-400';
        break;
      case 'media':
        corPrioridade = 'text-yellow-400';
        break;
      case 'alta':
        corPrioridade = 'text-red-400';
        break;
      default:
        corPrioridade = 'text-gray-400';
    }

    const tituloLink = document.createElement('a');
    tituloLink.href = `detalhes.html?${new URLSearchParams({
      id: tarefa.id,
      titulo: tarefa.titulo,
      dataTarefa: tarefa.dataTarefa,
      comentario: tarefa.comentario,
      prioridade: tarefa.prioridade,
      notificacao: tarefa.notificacao,
      dataCriacao: tarefa.dataCriacao
    }).toString()}`;

    tituloLink.textContent = tarefa.titulo;
    tituloLink.classList.add('font-semibold', 'text-blue-400', 'hover:underline', 'text-lg');

    li.appendChild(tituloLink);
    li.insertAdjacentHTML(
      'beforeend', `<span class="text-gray-400 text-sm md:text-base"> 
    - ${tarefa.dataTarefa} 
    - Prioridade: <span class="font-medium capitalize ${corPrioridade}">
    ${tarefa.prioridade}</span></span>`);

    const detalhes = document.createElement('div');
    detalhes.classList.add('w-full', 'mt-2', 'text-gray-300', 'space-y-1');
    detalhes.innerHTML = `
      <p><strong>Comentário:</strong> ${tarefa.comentario}</p>
      <p><strong>Data de Criação:</strong> ${tarefa.dataCriacao}</p>
    `;
    detalhes.style.display = 'none';

    const divBotoes = document.createElement('div');
    divBotoes.classList.add('flex', 'space-x-2', 'mt-2', 'w-full', 'md:w-auto');

    const botaoDetalhes = document.createElement('button');
    botaoDetalhes.textContent = 'Detalhes';
    botaoDetalhes.classList.add(
      'bg-blue-500', 'hover:bg-blue-600',
      'text-white', 'py-1', 'px-3', 'rounded', 'text-sm');

    botaoDetalhes.addEventListener('click', () => {
      if (detalhes.style.display === 'none') {
        detalhes.style.display = 'block';
        botaoDetalhes.textContent = 'Ocultar';
      } else {
        detalhes.style.display = 'none';
        botaoDetalhes.textContent = 'Detalhes';
      }
    });

    const botaoRemover = document.createElement('button');
    botaoRemover.textContent = 'Remover';
    botaoRemover.classList.add(
      'bg-red-500', 'hover:bg-red-600',
      'text-white', 'py-1', 'px-3', 'rounded', 'text-sm');

    botaoRemover.addEventListener('click', () => {
      removerTarefa(tarefa.id);
    });

    const botaoEditar = document.createElement('button');
    botaoEditar.textContent = 'Editar';
    botaoEditar.classList.add(
      'bg-yellow-500', 'hover:bg-yellow-600',
      'text-white', 'py-1', 'px-3', 'rounded', 'text-sm');

    botaoEditar.addEventListener('click', () => {
      preencherFormularioParaEdicao(tarefa);
    });

    divBotoes.appendChild(botaoDetalhes);
    divBotoes.appendChild(botaoEditar);
    divBotoes.appendChild(botaoRemover);

    li.appendChild(divBotoes);
    li.appendChild(detalhes);

    listaDeTarefas.appendChild(li);
  });
}

formulario.addEventListener('submit', function(event) {
  event.preventDefault();

  const titulo = document.getElementById('tituloTarefa').value;
  const dataTarefa = document.getElementById('dataTarefa').value;
  const comentario = document.getElementById('comentario').value;
  const prioridade = document.querySelector('input[name="prioridade"]:checked').value;
  const notificacao = document.querySelector('input[name="notificacao"]:checked').value;

  if (edicao) {
    tarefas = tarefas.map(tarefa => {
      if (tarefa.id === edicao) {
        return {
          ...tarefa,
          titulo,
          dataTarefa,
          comentario,
          prioridade,
          notificacao
        };
      } else {
        return tarefa;
      }
    });

    edicao = null;
    formulario.querySelector('input[type="submit"]').value = 'Adicionar Tarefa';
  } else {
    const novaTarefa = criarTarefa({
      titulo,
      dataTarefa,
      comentario,
      prioridade,
      notificacao
    });

    tarefas.push(novaTarefa);
  }

  renderizarTarefas();
  formulario.reset();
});

formulario.addEventListener('reset', function() {
  edicao = null;
  formulario.querySelector('input[type="submit"]').value = 'Adicionar Tarefa';
});

filtro.addEventListener('change', renderizarTarefas);

renderizarTarefas();
