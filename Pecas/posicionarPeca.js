const userInput = require('@desco/node-user-input')

const Tela = require('../Tela')
const Tabuleiro = require('../Tabuleiro')

const girar = _peca => {
    const Pecas = require('../Pecas')

    const pergunta = `Qual o ângulo em que deseja posicionar a peça ${_peca.nome} ${_peca.num}? ` +
        `(${Pecas.angulos.join(', ')})`

    const validacao = resposta => {
        resposta = parseInt(resposta)

        if (Pecas.angulos.indexOf(resposta) === -1) {
            const tabuleiro = Tabuleiro.gerar()

            Tela.setArray(tabuleiro).renderizar()

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
                const tabuleiro = Tabuleiro.gerar()

                Tela.setArray(tabuleiro).renderizar()

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
            const tabuleiro = Tabuleiro.gerar()

            Tela.setArray(tabuleiro).renderizar()

            return Promise.resolve(peca)

        })
    }

    return promessa
        .then(peca => {
            return posicionar(peca)
        })
        .then(peca => {
            const tabuleiro = Tabuleiro.gerar()

            Tela.setArray(tabuleiro).renderizar()

            const Pecas = require('../Pecas')

            Pecas.pecas[global.jogador][peca.id].pos = peca.pos
            Pecas.pecas[global.jogador][peca.id].angulo = peca.angulo
            Pecas.pecas[global.jogador][peca.id].areas = Tabuleiro.getAreasOcupadasPeca(
                peca.id, peca.pos, peca.angulo
            )

            Tabuleiro.setAreasRestritasPeca(Pecas.pecas[global.jogador][peca.id])
        })
        .catch(() => {
            return posicionarPeca(_peca)
        })
}

module.exports = posicionarPeca