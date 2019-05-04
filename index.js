const trocarJogador = require('./trocarJogador')

const Pecas = require('./Pecas')

Promise.resolve()
    .then(() => {
        trocarJogador(1, false)
    })
    .then(() => {
        return Pecas.setPos()
    })
    .then(() => {
        return trocarJogador(2)
    })
    .then(() => {
        return Pecas.setPos()
    })
    .catch(e => {
        console.log(e)
    })