const readline = require('readline')

const criarPecas = tiposPeca => {
  const pecas = []

  tiposPeca.map(tipoPeca => {
    for (let c = 0, max = tipoPeca.qtd ; c < max; c++) {
      delete tipoPeca.qtd

      pecas.push(tipoPeca)
    }
  })

  return pecas
}

const posicionarPecas = (_pecas, _pecasPosicionadas = []) => {
    const pecas = [ ..._pecas, ]
    const peca = pecas.shift()
    const pecasPosicionadas = [ ..._pecasPosicionadas, ]

    return posicionarPeca(peca).then(peca => {
      pecasPosicionadas.push(peca)

      if (pecas.length === 0) {
        return Promise.resolve(pecasPosicionadas)
      }

      return posicionarPecas(pecas, pecasPosicionadas)
    })
}

const posicionarPeca = peca => {
  const pergunta = `Qual a posição da peça de "${peca.nome}"?`

  return new Promise(resolve => {
    const Interface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    Interface.question(pergunta, resposta => {
      peca.pos = resposta

      resolve(peca)

      Interface.close()
    })
  })
}

class Pecas {
  constructor () {
    this.tiposPeca = [
      { nome: 'Hidroavião', qtd: 5, tam: 3, desvio: 1, },
      { nome: 'Encouraçado', qtd: 2, tam: 4, desvio: false, },
      { nome: 'Porta-Aviao', qtd: 1, tam: 5, desvio: false, },
      { nome: 'Submarino', qtd: 4, tam: 1, desvio: false, },
      { nome: 'Cruzador', qtd: 3, tam: 2, desvio: false, }
    ]
  }

  setPos () {
    this.pecas = criarPecas(this.tiposPeca)

    return posicionarPecas(this.pecas)
  }
}

module.exports = new Pecas()