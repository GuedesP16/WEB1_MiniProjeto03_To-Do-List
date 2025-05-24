const parametros = new URLSearchParams(window.location.search);

const titulo = parametros.get('titulo');
const dataTarefa = parametros.get('dataTarefa');
const comentario = parametros.get('comentario');
const prioridade = parametros.get('prioridade');
const notificacao = parametros.get('notificacao');
const dataCriacao = parametros.get('dataCriacao');

document.getElementById('titulo').textContent = titulo;
document.getElementById('dataTarefa').textContent = dataTarefa;
document.getElementById('comentario').textContent = comentario;
document.getElementById('prioridade').textContent = prioridade;
document.getElementById('notificacao').textContent = notificacao;
document.getElementById('dataCriacao').textContent = dataCriacao;

const hoje = new Date();
const data = new Date(dataTarefa);

hoje.setHours(0, 0, 0, 0);
data.setHours(0, 0, 0, 0);

const situacao = data < hoje ? 'Atrasada' : 'Dentro do prazo';

document.getElementById('statusTarefa').textContent = situacao;
document.getElementById('statusTarefa').classList.add(data < hoje ? 'text-red-600' : 'text-green-600');
