const userInput = require('@desco/node-user-input')

const Tela = require('../Tela')
const Tabuleiro = require('../Tabuleiro')
const Pecas = require('../Pecas')

class Jogador {
    // TODO:  Adversario tb em global
    trocar (_jogador, _pergunta = true) {
        global.jogador = _jogador

        Tela.clear()

        if (_pergunta) {
            return userInput(
                `Hora de trocar para o jogador ${_jogador}, pressione enter quando tiver trocado`
            )
        }

        return Promise.resolve()
    }

    atacar () {
        this.renderizarTabuleiros()

        const validacao = resposta => {
            return Tabuleiro.validarPosicao(resposta.toUpperCase()).catch(e => {
                this.renderizarTabuleiros()

                return Promise.reject(e)
            })
        }

        return userInput('Entre com a posição em que deseja atacar:', validacao).then(resposta => {
            const adversario = global.jogador === 1 ? 2 : 1
            const pos = resposta.toUpperCase()
            const pecaAtacada = Tabuleiro.getPecaPorPosicao(pos, adversario)
            const acertou = !!pecaAtacada

            Tabuleiro.areasAtacadas[global.jogador][pos] = acertou

            this.renderizarTabuleiros()

            if (acertou) {
                pecaAtacada.areasAtacadas.push(pos)

                pecaAtacada.afundou = pecaAtacada.areasAtacadas.length === pecaAtacada.tam
                Pecas.pecas[adversario][pecaAtacada.id] = pecaAtacada
            }

            return userInput(`${acertou ? 'Acertou' : 'Errou'}! Pressione Enter, para prosseguir`)
        })
    }

    renderizarTabuleiros () {
        const tabuleiro = Tabuleiro.gerar()
        const tabuleiroAuxiliar = Tabuleiro.gerarAuxiliar()

        Tela.setArray(tabuleiro).setArray(tabuleiroAuxiliar, 1, 12).renderizar()
    }
}

module.exports = new Jogador()