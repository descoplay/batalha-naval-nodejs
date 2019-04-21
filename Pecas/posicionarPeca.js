const userInput = require('@desco/node-user-input')

const clear = require('../clear')
const Tabuleiro = require('../Tabuleiro')

const girar = _peca => {
    const Pecas = require('../Pecas')

    const pergunta = `Qual o ângulo em que deseja posicionar a peça ${_peca.nome} ${_peca.num}? ` +
        `(${Pecas.angulos.join(', ')})`

    const validacao = resposta => {
        resposta = parseInt(resposta)

        if (Pecas.angulos.indexOf(resposta) === -1) {
            clear()
            Tabuleiro.gerar()

            return Promise.reject({ type: 'repeat', message: 'Ângulo inválido', })
        }

        return Promise.resolve()
    }

    return userInput(pergunta, validacao).then(resposta => {
        return Promise.resolve({ ..._peca, angulo: parseInt(resposta), })
    })
}

const posicionar = _peca => {
    const peca = { ..._peca, }
    const pergunta = `Onde deseja posicionar a peça ${peca.nome} ${peca.num}?`

    const validacao = resposta => {
        return Tabuleiro.validarPosicaoPeca(peca.id, resposta, peca.angulo)
            .catch(erro => {
                clear()
                Tabuleiro.gerar()

                erro.type = 'break'

                return Promise.reject(erro)
            })
    }

    return userInput(pergunta, validacao).then(resposta => {
        return Promise.resolve({ ..._peca, pos: resposta.toUpperCase(), })
    })
}

const posicionarPeca = _peca => {
    let promessa = Promise.resolve()

    if (_peca.tam >= 1) {
        promessa = girar({ ..._peca, }).then(peca => {
            clear()
            Tabuleiro.gerar()

            return Promise.resolve(peca)

        })
    }

    return promessa
        .then(peca => {
            return posicionar(peca)
        })
        .then(peca => {
            clear()
            Tabuleiro.gerar()

            const Pecas = require('../Pecas')

            Pecas.pecas[peca.id].pos = peca.pos
            Pecas.pecas[peca.id].angulo = peca.angulo
        })
        .catch(() => {
            return posicionarPeca(_peca)
        })
}

module.exports = posicionarPeca