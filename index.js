const Jogo = require('./Jogo')
const Jogador = require('./Jogador')

// TODO: Todas as ocorrenias de getAreasOcupadasPeca que puderem ser trocadas por peca.areas, trocar

Jogo.setPos()
    .then(() => {
        return Jogador.trocar(1)
    })
    .then(() => {
        return Jogo.iniciar()
    })
    .catch(e => {
        console.log(e)
    })