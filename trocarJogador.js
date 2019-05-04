const userInput = require('@desco/node-user-input')

const clear = require('./clear')

module.exports = (_jogador, _pergunta = true) => {
    clear()

    global.jogador = _jogador

    if (_pergunta) {
        return userInput(
            `Hora de trocar para o jogador ${_jogador}, pressione enter quando tiver trocado`
        )
    }

    return Promise.resolve()
}