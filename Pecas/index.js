const objectMap = require('object-map')

const userInput = require('@desco/node-user-input')

const Tela = require('../Tela')
const Tabuleiro = require('../Tabuleiro')

const criarPecas = require('./criarPecas')
const posicionarPeca = require('./posicionarPeca')

class Pecas {
    constructor () {
        this.angulos = [ 0, 90, 180, 270, ]
        this.tiposPeca = [
            // { nome: 'Hidroavião', qtd: 5, tam: 3, desvio: 1, },
            // { nome: 'Encouraçado', qtd: 2, tam: 4, desvio: false, },
            { nome: 'Porta-Aviao', qtd: 1, tam: 5, desvio: false, },
            // { nome: 'Submarino', qtd: 4, tam: 1, desvio: false, },
            // { nome: 'Cruzador', qtd: 3, tam: 2, desvio: false, },
        ]

        this.pecas = {}
        this.pecas[1] = criarPecas(this.tiposPeca)
        this.pecas[2] = criarPecas(this.tiposPeca)
    }

    selecionarPeca (_pergunta) {
        const tabuleiro = Tabuleiro.gerar()

        Tela.setArray(tabuleiro).renderizar()

        let pergunta = _pergunta + '\n\n'

        objectMap(this.pecas[global.jogador], peca => {
            pergunta += `${peca.id} | ${peca.nome} ${peca.num}`

            if (peca.pos) {
                pergunta += ' [Já posicionada]'
            }

            pergunta += '\n'
        })

        pergunta += '\nCódigo:'

        return userInput(pergunta, resposta => {
            const codigos = Object.keys(this.pecas[global.jogador])

            resposta = resposta.toUpperCase()

            if (codigos.indexOf(resposta) === -1) {
                const tabuleiro = Tabuleiro.gerar()

                Tela.setArray(tabuleiro).renderizar()

                return Promise.reject({ type: 'repeat', message: 'Código inválido', })
            }

            return Promise.resolve()
        }).then(resposta => {
            resposta = resposta.toUpperCase()

            return Promise.resolve(this.pecas[global.jogador][resposta])
        })
    }

    tudoPosicionado () {
        let tudoPosicionado = true

        objectMap(this.pecas[global.jogador], peca => {
            if (!peca.pos) {
                tudoPosicionado = false
            }
        })

        return tudoPosicionado
    }

    setPos () {
        return this.selecionarPeca('Qual a peça a ser posicionada?')
            .then(peca => {
                const tabuleiro = Tabuleiro.gerar()

                Tela.setArray(tabuleiro).renderizar()

                return posicionarPeca(peca)
            })
            .then(() => {
                if (this.tudoPosicionado()) {
                    const tabuleiro = Tabuleiro.gerar()

                    Tela.setArray(tabuleiro).renderizar()

                    const pergunta = 'Todas as peças foram posicionadas. Seguir para a próxima '
                        + 'etapa? (S/N)'

                    return userInput(pergunta, resposta => {
                        if ([ 'S', 'N', ].indexOf(resposta.toUpperCase()) === -1) {
                            const tabuleiro = Tabuleiro.gerar()

                            Tela.setArray(tabuleiro).renderizar()

                            return Promise.reject({ type: 'repeat', message: 'Resposta inválida', })
                        }

                        return Promise.resolve()
                    }).then(resposta => {
                        resposta = resposta.toUpperCase()

                        if (resposta === 'S') {
                            return Promise.resolve()
                        }
                        else {
                            return this.setPos()
                        }
                    })
                }
                else {
                    return this.setPos()
                }
            })
    }

    tudoAfundado (_jogador) {
        const pecas = Object.values(this.pecas[_jogador])
        const afundaram = pecas.map(peca => peca.afundou)

        return afundaram.indexOf(false) === -1
    }
}

module.exports = new Pecas()