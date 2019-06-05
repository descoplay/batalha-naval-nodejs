const gerarLinha = require('./gerarLinha')
const gerarLinhaAlfa = require('./gerarLinhaAlfa')

const letras = require('../letras')

// TODO: Label do tabuleito
module.exports = (_conteudo) => {
    const tabuleiro = []

    tabuleiro.push(gerarLinha(true))

    letras.map(letra => {
        tabuleiro.push(gerarLinha())
        tabuleiro.push(gerarLinhaAlfa(letra, _conteudo))
    })

    tabuleiro.push(gerarLinha())
    tabuleiro.push('')

    return tabuleiro
}