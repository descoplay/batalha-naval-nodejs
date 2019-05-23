const Jogo = require('./Jogo')

Jogo.setPos()
    .then(() => {
        return Jogo.iniciar()
    })
    .catch(e => {
        console.log(e)
    })