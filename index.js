const transacoesVetor = []

// ================= DOM ELEMENTS =================
let saldoTotal = document.getElementById("saldo-total");
let valorDespesas = document.getElementById("valor-despesas");
let valorReceitas = document.getElementById("valor-receitas");

let receitasInput = document.getElementById("receitas");
let despesasInput = document.getElementById("despesas");
let saldoInput = document.getElementById("saldo");

let dataInput = document.getElementById("data");
let pesquisaInput = document.getElementById("pesquisar");

let categoriaInput = document.getElementById("categoria");

let botaoSobre = document.querySelector(".about");
let sobreCard = document.querySelector(".sobre-card");
let fecharSobre = document.querySelector(".fechar");

let botaoNovaTransacao = document.querySelector(".transacao");
let novaTransacaoCard = document.querySelector(".nova-transacao");
let fecharNovaTransacao = document.querySelector(".fechar-transacao");

let formTransacao = document.getElementById("form-transacao");
let descricaoInput = document.getElementById("descricao");
let valorInput = document.getElementById("valor");

let historicoTransacoes = document.querySelector(".transacoes-historico");

let apagarTdBotao = document.querySelector('.apagarTudo');


// ================= EVENTOS UI =================

// abrir/fechar modais
botaoNovaTransacao.addEventListener('click', () => {
  novaTransacaoCard.classList.add('mostrar-transacao')
})

fecharNovaTransacao.addEventListener('click', () => {
  novaTransacaoCard.classList.remove('mostrar-transacao')
  formTransacao.reset()
})

botaoSobre.addEventListener('click', () => {
  sobreCard.classList.add('sobre-card-show')
  novaTransacaoCard.classList.remove('mostrar-transacao')
})

fecharSobre.addEventListener('click', () => {
  sobreCard.classList.remove('sobre-card-show')
})


// ================= FORM SUBMIT =================
formTransacao.addEventListener('submit', function (event) {
  event.preventDefault()

  const tipo = document.querySelector('input[name="tipo"]:checked').value;

  let valor = Number(valorInput.value.replace(',', '.'))

  if (isNaN(valor)) {
    alert('insira um valor válido')
    return
  }

  const novaTransacao = {
    descricao: descricaoInput.value,
    valor: valor,
    tipo: tipo,
    categoria: categoriaInput.value,
    data: dataInput.value
  }

  transacoesVetor.push(novaTransacao)

  calcular()
  renderizarHistorico()
  salvarDados()

  formTransacao.reset()
  novaTransacaoCard.classList.remove('mostrar-transacao')
})


// ================= RENDER =================
function renderizarHistorico(lista = transacoesVetor) {

  historicoTransacoes.innerHTML = ""

  if (lista.length === 0) {
    apagarTdBotao.classList.add('apagarEsconder')
    historicoTransacoes.innerHTML = "<li>Não há transações</li>"
    return
  }

  apagarTdBotao.classList.remove('apagarEsconder')

  lista.forEach(function (transacao) {

    let li = document.createElement('li')

    li.innerText =
`Categoria: ${transacao.categoria}
Descrição: ${transacao.descricao}
Valor: ${moeda(transacao.valor)}
Data: ${transacao.data}`

    let btn = document.createElement('button')
    btn.innerText = 'X'
    btn.classList.add('apagar-li')

    btn.addEventListener('click', function () {
      let indiceReal = transacoesVetor.indexOf(transacao)

      transacoesVetor.splice(indiceReal, 1)

      calcular()
      renderizarHistorico()
      salvarDados()
    })

    li.appendChild(btn)
    historicoTransacoes.appendChild(li)
  })
}


// ================= CALCULO =================
function calcular() {

  let totalReceita = 0
  let totalDespesas = 0

  transacoesVetor.forEach(function (transacao) {
    if (transacao.tipo === 'receita') {
      totalReceita += transacao.valor
    } else {
      totalDespesas += transacao.valor
    }
  })

  let saldo = totalReceita - totalDespesas

  saldoTotal.style.color = saldo < 0 ? 'red' : 'green'

  saldoTotal.innerText = moeda(saldo)
  valorReceitas.innerText = moeda(totalReceita)
  valorDespesas.innerText = moeda(totalDespesas)
}


// ================= MOEDA =================
function moeda(valor) {
  return valor.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL'
  })
}


// ================= LOCAL STORAGE =================
function salvarDados() {
  localStorage.setItem('transacoes', JSON.stringify(transacoesVetor))
}

function carregarDados() {
  let dados = localStorage.getItem('transacoes')

  if (!dados) return

  let transacoesSalvas = JSON.parse(dados)

  transacoesVetor.push(...transacoesSalvas)
}


// ================= FILTROS =================

// pesquisa
pesquisaInput.addEventListener('input', function () {
  let texto = pesquisaInput.value.toLowerCase()

  let resultado = transacoesVetor.filter(t =>
    t.descricao.toLowerCase().includes(texto)
  )

  renderizarHistorico(resultado)
})


// despesas
despesasInput.addEventListener('click', function () {
  let filtrado = transacoesVetor.filter(t => t.tipo === 'despesa')
  renderizarHistorico(filtrado)
})


// receitas
receitasInput.addEventListener('click', function () {
  let filtrado = transacoesVetor.filter(t => t.tipo === 'receita')
  renderizarHistorico(filtrado)
})


// saldo (tudo)
saldoInput.addEventListener('click', function () {
  renderizarHistorico()
})


// ================= INIT =================
carregarDados()
renderizarHistorico()
calcular()