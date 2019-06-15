const objectMap = require('object-map')
const intersect = require('intersect')

const letras = require('./letras')

const gerarTabuleiro = require('./gerarTabuleiro')

class Tabuleiro {
    constructor () {
        this.areasAtacadas = { 1: {}, 2: {}, }
        this.areasRestritas = []
    }

    gerar () {
        const pecas = require('../Pecas').pecas[global.jogador]
        const pecasPorArea = {}

        objectMap(pecas, peca => {
            if (!peca.areas) {
                return
            }

            peca.areas.map(area => {
                pecasPorArea[area] = peca.id
            })
        })

        return gerarTabuleiro(pecasPorArea)
    }

    gerarAuxiliar () {
        const areasAtacadas = {}

        objectMap(this.areasAtacadas[global.jogador], (seAcertou, areaAtacada) => {
            areasAtacadas[areaAtacada] = seAcertou || 'XX'
        })

        return gerarTabuleiro(areasAtacadas)
    }

    validarPosicaoPeca (idPeca, posicao, angulo) {
        posicao = posicao.toUpperCase()

        return this.validarPosicao(posicao)
            .then(() => {
                return this.validarSobreposicao(idPeca, posicao, angulo)
            })
            .then(() => {
                return this.validarProximidade(idPeca, posicao, angulo)
            })
    }

    validarPosicao (posicao, _promise = true) {
        const { letra, numero, } = this.desmembrarPosicao(posicao)

        const letraValida = letra >= 'A' && letra <= 'P'
        const numeroValido = numero >= 1 && numero <= 15

        const valido = letraValida && numeroValido

        if (valido) {
            return _promise ? Promise.resolve() : true
        }
        else {
            return _promise ? Promise.reject({
                message: 'A posição deve estar entre A1 e P15',
                type: 'repeat',
            }) : false
        }
    }

    // TODO: Deve receber apenas a peça em si
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

    getAreasOcupadas (_jogador = global.jogador) {
        const Pecas = require('../Pecas').pecas[_jogador]
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

    validarProximidade (idPeca, posicao, angulo) {
        const areasPeca = this.getAreasOcupadasPeca(idPeca, posicao, angulo)

        if (intersect(areasPeca, this.areasRestritas).length > 0) {
            return Promise.reject({
                message: 'Parte da peça se encontra muito próxima a outra peça\nDeixe ao menos um' +
                    ' quadrado de espaço entre as peças',
                type: 'repeat',
            })
        }

        return Promise.resolve()
    }

    getPecaPorPosicao (pos, _jogador) {
        const Pecas = require('../Pecas').pecas[_jogador]
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

    setAreasRestritasPeca (_Peca) {
        _Peca.areas.map(area => {
            area = this.desmembrarPosicao(area)

            const areaSuperior = this.desviarLetra(area.letra, 1) + area.numero
            const areaSuperiorLivre = _Peca.areas.indexOf(areaSuperior) === -1
            const areaSuperiorValida = this.validarPosicao(areaSuperior, false)

            if (areaSuperiorLivre && areaSuperiorValida) {
                this.areasRestritas.push(areaSuperior)
            }

            const areaInferior = this.desviarLetra(area.letra, -1) + area.numero
            const areaInferiorLivre = _Peca.areas.indexOf(areaInferior) === -1
            const areaInferiorValida = this.validarPosicao(areaInferior, false)

            if (areaInferiorLivre && areaInferiorValida) {
                this.areasRestritas.push(areaInferior)
            }

            const areaDireita = area.letra + (area.numero + 1)
            const areaDireitaLivre = _Peca.areas.indexOf(areaDireita) === -1
            const areaDireitaValida = this.validarPosicao(areaDireita, false)

            if (areaDireitaLivre && areaDireitaValida) {
                this.areasRestritas.push(areaDireita)
            }

            const areaEsquerda = area.letra + (area.numero - 1)
            const areaEsquerdaLivre = _Peca.areas.indexOf(areaEsquerda) === -1
            const areaEsquerdaValida = this.validarPosicao(areaEsquerda, false)

            if (areaEsquerdaLivre && areaEsquerdaValida) {
                this.areasRestritas.push(areaEsquerda)
            }
        })
    }
}

module.exports = new Tabuleiro()