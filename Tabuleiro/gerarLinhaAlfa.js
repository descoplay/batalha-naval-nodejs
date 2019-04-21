const letras = require('./letras')
const gerarColuna = require('./gerarColuna')

module.exports = letra => {
    const Tabuleiro = require('../Tabuleiro')

    let linha = ''
    const areasOcupadas = Tabuleiro.getAreasOcupadas()

    linha = `${letra} |`

    for (let numero = 1, max = letras.length; numero <= max; numero++) {
        const pos = `${letra}${numero}`

        if (areasOcupadas.indexOf(pos) === -1) {
            linha += gerarColuna()
        }
        else {
            const Peca = Tabuleiro.getPecaPorPosicao(pos)

            linha += gerarColuna(Peca.id)
        }
    }

    console.log(linha)
}