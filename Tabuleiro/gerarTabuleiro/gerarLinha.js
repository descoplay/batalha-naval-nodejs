const letras = require('../letras')
const gerarColuna = require('./gerarColuna')

module.exports = (exibirNumeros = false) => {
    let linhaRenderizada = '   '

    letras.map((letra, pos) => {
        pos++

        if (exibirNumeros) {
            pos = `${pos}`.padStart(2, '0')

            linhaRenderizada += gerarColuna(pos)
        }
        else {
            linhaRenderizada += '-------'
        }
    })

    return linhaRenderizada
}