const userInput = require('@desco/node-user-input')

const Tela = require('./Tela')

module.exports = (_jogador, _pergunta = true) => {
    global.jogador = _jogador

    Tela.clear()

    if (_pergunta) {
        return userInput(
            `Hora de trocar para o jogador ${_jogador}, pressione enter quando tiver trocado`
        )
    }

    return Promise.resolve()
}