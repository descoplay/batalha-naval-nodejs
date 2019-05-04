const objectMap = require('object-map')
const intersect = require('intersect')

const letras = require('./letras')

const gerarLinha = require('./gerarLinha')
const gerarLinhaAlfa = require('./gerarLinhaAlfa')

class Tabuleiro {
    gerar () {
        const tabuleiro = []

        tabuleiro.push(gerarLinha(true))

        letras.map(letra => {
            tabuleiro.push(gerarLinha())
            tabuleiro.push(gerarLinhaAlfa(letra))
        })

        tabuleiro.push(gerarLinha())
        tabuleiro.push('')

        return tabuleiro
    }

    validarPosicaoPeca (idPeca, posicao, angulo) {
        posicao = posicao.toUpperCase()

        return this.validarPosicao(idPeca, posicao)
            .then(() => {
                return this.validarSobreposicao(idPeca, posicao, angulo)
            })
    }

    validarPosicao (idPeca, posicao) {
        const { letra, numero, } = this.desmembrarPosicao(posicao)

        const letraValida = letra >= 'A' && letra <= 'P'
        const numeroValido = numero >= 1 && numero <= 15

        const valido = letraValida && numeroValido

        if (valido) {
            return Promise.resolve()
        }
        else {
            return Promise.reject({
                message: 'A posição deve estar entre A1 e P15',
                type: 'repeat',
            })
        }
    }

    getAreasOcupadasPeca (idPeca, posicao, angulo) {
        const Pecas = require('../Pecas')
        const Peca = Pecas.pecas[global.jogador][idPeca]
        const areas = []

        const { letra, numero, } = this.desmembrarPosicao(posicao)

        for (let c = 0; c < Peca.tam; c++) {
            let letraArea = letra
            let numeroArea = numero

            switch (angulo) {
                case 0: {
                    numeroArea += c

                    if (Peca.desvio === c) {
                        letraArea = this.desviarLetra(letraArea)
                    }
                }
                    break
                case 90: {
                    letraArea = this.desviarLetra(letraArea, c * -1)

                    if (Peca.desvio === c) {
                        numeroArea += 1
                    }
                }
                    break
                case 180: {
                    numeroArea += c * -1

                    if (Peca.desvio === c) {
                        letraArea = this.desviarLetra(letraArea, -1)
                    }
                }
                    break
                case 270: {
                    letraArea = this.desviarLetra(letraArea, c)

                    if (Peca.desvio === c) {
                        numeroArea += -1
                    }
                }
            }

            if (numeroArea > 15 || numeroArea < 1) {
                numeroArea = '*'
            }

            areas.push(`${letraArea}${numeroArea}`)
        }

        return areas
    }

    getAreasOcupadas () {
        const Pecas = require('../Pecas').pecas[global.jogador]
        let areas = []

        objectMap(Pecas, (Peca, idPeca) => {
            if (!Peca.pos) {
                return
            }

            areas = areas.concat(this.getAreasOcupadasPeca(idPeca, Peca.pos, Peca.angulo))
        })

        return areas
    }

    desmembrarPosicao (posicao) {
        const letra = posicao[0]
        const numero = parseInt(posicao.slice(1))

        return { letra, numero, }
    }

    desviarLetra (letra, count = 1) {
        const pos = letras.indexOf(letra) - count

        if (pos < 0) {
            return '*'
        }

        return letras[pos]
    }

    validarSobreposicao (idPeca, posicao, angulo) {
        const areasPeca = this.getAreasOcupadasPeca(idPeca, posicao, angulo)
        const areas = this.getAreasOcupadas()
        const validas = []

        areasPeca.map(area => {
            validas.push(area.indexOf('*') === -1)
        })
        console.log(areasPeca)
        if (validas.indexOf(false) !== -1) {
            return Promise.reject({
                message: 'Parte da peça se encontra fora do tabuleiro',
                type: 'repeat',
            })
        }

        if (intersect(areas, areasPeca).length > 0) {
            return Promise.reject({
                message: 'Parte da peça se encontra em uma área ocupada por outra peça' +
                    ' posicionada',
                type: 'repeat',
            })
        }

        return Promise.resolve()
    }

    getPecaPorPosicao (pos) {
        const Pecas = require('../Pecas').pecas[global.jogador]
        let aRetornar

        objectMap(Pecas, (Peca, idPeca) => {
            if (!Peca.pos) {
                return
            }

            const pecaAreas = this.getAreasOcupadasPeca(idPeca, Peca.pos, Peca.angulo)

            if (pecaAreas.indexOf(pos) !== -1) {
                aRetornar = Peca
            }
        })

        return aRetornar
    }
}

module.exports = new Tabuleiro()