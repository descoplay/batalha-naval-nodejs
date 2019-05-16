const letras = require('../letras')
const gerarColuna = require('./gerarColuna')

module.exports = (_letra, _conteudo = {}) => {
    let linha = ''

    linha = `${_letra} |`

    for (let numero = 1, max = letras.length; numero <= max; numero++) {
        const pos = `${_letra}${numero}`

        if (!_conteudo[pos]) {
            linha += gerarColuna()
        }
        else {
            linha += gerarColuna(_conteudo[pos])
        }
    }

    return linha
}