const Jogador = require('../Jogador')
const Pecas = require('../Pecas')

const finalizar = require('./finalizar')

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
                const adversario = _jogador === 1 ? 2 : 1

                if (!Pecas.tudoAfundado(adversario)) {
                    return this.iniciar(adversario)
                }
                else {
                    return finalizar(_jogador, adversario)
                }
            })
    }
}

module.exports = new Jogo()