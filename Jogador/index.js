const userInput = require('@desco/node-user-input')

const Tela = require('../Tela')
const Tabuleiro = require('../Tabuleiro')

class Jogador {
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
            const pos = resposta.toUpperCase()
            const areas = Tabuleiro.getAreasOcupadas(global.jogador === 1 ? 2 : 1)
            const pressione = 'Pressione Enter, para prosseguir'

            Tabuleiro.areasAtacadas[global.jogador][pos] = areas.indexOf(pos) !== -1

            this.renderizarTabuleiros()

            if (Tabuleiro.areasAtacadas[global.jogador][pos]) {
                return userInput(`Acertou! ${pressione}`)
            }
            else {
                return userInput(`Errou! ${pressione}`)
            }
        })
    }

    renderizarTabuleiros () {
        const tabuleiro = Tabuleiro.gerar()
        const tabuleiroAuxiliar = Tabuleiro.gerarAuxiliar()

        Tela.setArray(tabuleiro).setArray(tabuleiroAuxiliar, 1, 12).renderizar()
    }
}

module.exports = new Jogador()