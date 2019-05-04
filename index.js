const clear = require('./clear')
const trocarJogador = require('./trocarJogador')

const Pecas = require('./Pecas')

clear()

Promise.resolve()
    .then(() => {
        trocarJogador(1, false)

        return Pecas.setPos()
    })
    .then(() => {
        return trocarJogador(2)
    })
    .then(() => {
        trocarJogador(2)

        return Pecas.setPos()
    })
    .catch(e => {
        console.log(e)
    })