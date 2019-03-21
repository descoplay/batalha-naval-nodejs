const objectMap = require('object-map')

const userInput = require('@desco/node-user-input')

const clear = require('./clear')
const Tabuleiro = require('./Tabuleiro')

const criarPecas = tiposPeca => {
    const pecas = {}

    tiposPeca.map(tipoPeca => {
        for (let c = 0, max = tipoPeca.qtd ; c < max; c++) {
            const peca = { ...tipoPeca, num: c + 1, }

            delete peca.qtd

            pecas[`${peca.nome}-${peca.num}`] = peca
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
    }

    setPos () {
        this.pecas = criarPecas(this.tiposPeca)

        const perguntas = {}

        objectMap(this.pecas, (peca, chave) => {
            perguntas[chave] = `Qual a posição da peça "${peca.nome}" de número ${peca.num}?`
        })

        Tabuleiro.gerar()

        return userInput(perguntas, (idPeca, posicao) => {
            return Tabuleiro.validarPosicaoPeca(idPeca, posicao).then(() => {
                this.pecas[idPeca].pos = posicao.toUpperCase()

                clear()
                Tabuleiro.gerar()
            })
        })
    }
}

module.exports = new Pecas()