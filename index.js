const Jogo = require('./Jogo')

// TODO: Todas as ocorrenias de getAreasOcupadasPeca que puderem ser trocadas por peca.areas, trocar

Jogo.setPos()
    .then(() => {
        return Jogo.iniciar()
    })
    .catch(e => {
        console.log(e)
    })