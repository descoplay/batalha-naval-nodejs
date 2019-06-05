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

    iniciar (_jogador = 1, _jogada = 1) {
        return Jogador.atacar()
            .then(() => {
                const adversario = _jogador === 1 ? 2 : 1

                if (!Pecas.tudoAfundado(adversario)) {
                    if (_jogada < 3) {
                        return this.iniciar(_jogador, _jogada + 1)
                    }
                    else {
                        return Jogador.trocar(adversario).then(() => {
                            return this.iniciar(adversario)
                        })
                    }
                }
                else {
                    return finalizar(_jogador, adversario)
                }
            })
    }
}

module.exports = new Jogo()