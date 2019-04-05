const objectMap = require('object-map')

const userInput = require('@desco/node-user-input')

const clear = require('./clear')
const Tabuleiro = require('./Tabuleiro')

const criarPecas = tiposPeca => {
    const pecas = {}

    tiposPeca.map(tipoPeca => {
        for (let c = 0, max = tipoPeca.qtd ; c < max; c++) {
            const peca = { ...tipoPeca, num: c + 1, }

            peca.id = peca.nome[0] + (peca.num)

            delete peca.qtd

            pecas[peca.id] = peca
        }
    })

    return pecas
}

class Pecas {
    constructor () {
        this.tiposPeca = [
            { nome: 'Hidroavião', qtd: 5, tam: 3, desvio: 1, },
            { nome: 'Encouraçado', qtd: 2, tam: 4, desvio: false, },
            { nome: 'Porta-Aviao', qtd: 1, tam: 5, desvio: false, },
            { nome: 'Submarino', qtd: 4, tam: 1, desvio: false, },
            { nome: 'Cruzador', qtd: 3, tam: 2, desvio: false, },
        ]

        this.pecas = criarPecas(this.tiposPeca)
    }

    selecionarPeca (_pergunta) {
        clear()

        Tabuleiro.gerar()

        let pergunta = _pergunta + '\n\n'

        objectMap(this.pecas, peca => {
            pergunta += `${peca.id} | ${peca.nome} ${peca.num}`

            if (peca.pos) {
                pergunta += ' [Já posicionada]'
            }

            pergunta += '\n'
        })

        pergunta += '\nCódigo:'

        return userInput([ pergunta, ], (chave, resposta) => {
            const codigos = Object.keys(this.pecas)

            resposta = resposta.toUpperCase()

            if (codigos.indexOf(resposta) === -1) {
                clear()
                Tabuleiro.gerar()

                return Promise.reject({ type: 'repeat', message: 'Código inválido', })
            }

            return Promise.resolve()
        }).then(resposta => {
            resposta = resposta[0].toUpperCase()

            return Promise.resolve(this.pecas[resposta])
        })
    }

    posicionarPeca (_peca) {
        clear()
        Tabuleiro.gerar()

        const peca = { ..._peca, }
        const pergunta = `Onde deseja posicionar a peça ${peca.nome} ${peca.num}?`

        return userInput([ pergunta, ], (chave, resposta) => {
            return Tabuleiro.validarPosicaoPeca(peca.id, resposta)
                .then(() => {
                    resposta = resposta.toUpperCase()

                    this.pecas[peca.id].pos = resposta

                    clear()
                    Tabuleiro.gerar()
                })
                .catch(erro => {
                    clear()

                    Tabuleiro.gerar()

                    return Promise.reject(erro)
                })
        })
    }

    tudoPosicionado () {
        let tudoPosicionado = true

        objectMap(this.pecas, peca => {
            if (!peca.pos) {
                tudoPosicionado = false
            }
        })

        return tudoPosicionado
    }

    setPos () {
        return this.selecionarPeca('Qual a peça a ser posicionada?')
            .then(peca => {
                return this.posicionarPeca(peca)
            })
            .then(() => {
                if (this.tudoPosicionado()) {
                    const pergunta = 'Todas as peças foram posicionadas. Seguir para a próxima '
                        + 'etapa? (S/N)'

                    return userInput([ pergunta, ], (chave, resposta) => {
                        if ([ 'S', 'N', ].indexOf(resposta.toUpperCase()) === -1) {
                            clear()
                            Tabuleiro.gerar()

                            return Promise.reject({ type: 'repeat', message: 'Resposta inválida', })
                        }

                        return Promise.resolve()
                    }).then(resposta => {
                        resposta = resposta[0].toUpperCase()

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
}

module.exports = new Pecas()