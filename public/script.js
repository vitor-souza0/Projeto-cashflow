const listaElement = document.getElementById('lista');
const saldoElement = document.getElementById('saldo-valor');
const form = document.getElementById('form-transacao');

// Função para buscar dados e calcular tudo
async function carregarDados() {
const res = await fetch('/api/transacoes');
const transacoes = await res.json();

listaElement.innerHTML = '';
let saldoTotal = 0;

transacoes.forEach(item => {
// 1. Converter valor para número (vem do banco como string ou number)
const valorNumerico = parseFloat(item.valor);

// 2. Calcular Saldo
if (item.tipo === 'entrada') {
saldoTotal += valorNumerico;
} else {
saldoTotal -= valorNumerico;
}

// 3. Criar o HTML da linha
const li = document.createElement('li');
li.className = 'item';

// Formata para moeda BRL
const valorFormatado = valorNumerico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

li.innerHTML = `
<div class="item-info ${item.tipo}">
<strong>${item.descricao}</strong>
<span>${new Date(item.data_criacao).toLocaleDateString()}</span>
</div>
<div style="display:flex; align-items:center;">
<span class="valor ${item.tipo}">${item.tipo === 'saida' ? '-' : '+'} ${valorFormatado}</span>
<button class="btn-delete" onclick="deletarItem(${item.id})">&times;</button>
</div>
`;
listaElement.appendChild(li);
});

// 4. Atualizar o Saldo na Tela
saldoElement.innerText = saldoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Muda a cor do saldo geral
saldoElement.style.color = saldoTotal >= 0 ? '#2ecc71' : '#e74c3c';
}

// Enviar formulário
form.addEventListener('submit', async (e) => {
e.preventDefault();

const descricao = document.getElementById('descricao').value;
const valor = document.getElementById('valor').value;
const tipo = document.getElementById('tipo').value;

await fetch('/api/transacoes', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ descricao, valor, tipo })
});

// Limpa campos e recarrega
document.getElementById('descricao').value = '';
document.getElementById('valor').value = '';
carregarDados();
});

// Deletar item
async function deletarItem(id) {
if(confirm('Tem certeza?')) {
await fetch(`/api/transacoes/${id}`, { method: 'DELETE' });
carregarDados();
}
}

// Inicia
carregarDados();
