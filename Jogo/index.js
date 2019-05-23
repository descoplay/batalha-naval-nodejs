const Jogador = require('../Jogador')
const Pecas = require('../Pecas')

class Jogo {
    setPos () {
        return Jogador.trocar(1, false)
            .then(() => {
                return Pecas.setPos()
            })
            .then(() => {
                return Jogador.trocar(2)
            })
            .then(() => {
                return Pecas.setPos()
            })
    }

    iniciar (_jogador = 1) {
        return Jogador.trocar(_jogador)
            .then(() => {
                return Jogador.atacar()
            })
            .then(() => {
                return this.iniciar(_jogador === 1 ? 2 : 1)
            })
    }
}

module.exports = new Jogo()