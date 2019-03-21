const objectMap = require('object-map')
const intersect = require('intersect')

const letras = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'L', 'M', 'N', 'O', 'P', ]

function gerarLinha (exibirNumeros = false) {
    let linhaRenderizada = '   '

    letras.map((letra, pos) => {
        pos++

        if (exibirNumeros) {
            const posStr = `${pos}`.padStart(3, ' ')

            linhaRenderizada += `  ${posStr}  |`
        }
        else {
            linhaRenderizada += '--------'
        }
    })

    console.log(linhaRenderizada)
}

function gerarLinhaAlfa (letra) {
    let linha = ''
    const areasOcupadas = Tabuleiro.getAreasOcupadas()

    linha = `${letra} |`

    for (let numero = 1, max = letras.length; numero <= max; numero++) {
        const pos = `${letra}${numero}`

        if (areasOcupadas.indexOf(pos) === -1) {
            linha += '       |'
        }
        else {
            linha += '   X   |'
        }
    }

    console.log(linha)
}

class TabuleiroClass {
    gerar () {
        gerarLinha(true)

        letras.map(letra => {
            gerarLinha()
            gerarLinhaAlfa(letra)
        })

        gerarLinha()

        console.log()
    }

    validarPosicaoPeca (idPeca, posicao) {
        posicao = posicao.toUpperCase()

        return this.validarPosicao(idPeca, posicao)
            .then(() => {
                return this.validarSobreposicao(idPeca, posicao)
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

    getAreasOcupadasPeca (idPeca, posicao) {
        const Pecas = require('./Pecas')
        const Peca = Pecas.pecas[idPeca]
        const areas = []

        const { letra, numero, } = this.desmembrarPosicao(posicao)

        for (let c = 0; c < Peca.tam; c++) {
            let letraArea = letra
            if (Peca.desvio === c) {
                letraArea = this.desviarLetra(letraArea)
            }

            areas.push(`${letraArea}${numero + c}`)
        }

        return areas
    }

    getAreasOcupadas () {
        const Pecas = require('./Pecas').pecas
        let areas = []

        objectMap(Pecas, (Peca, idPeca) => {
            if (!Peca.pos) {
                return
            }

            areas = areas.concat(this.getAreasOcupadasPeca(idPeca, Peca.pos))
        })

        return areas
    }

    desmembrarPosicao (posicao) {
        const letra = posicao[0]
        const numero = parseInt(posicao.slice(1))

        return { letra, numero, }
    }

    desviarLetra (letra) {
        const pos = letras.indexOf(letra) - 1

        if (pos < 0) {
            return '*'
        }

        return letras[pos]
    }

    validarSobreposicao (idPeca, posicao) {
        const areasPeca = this.getAreasOcupadasPeca(idPeca, posicao)
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
}

const Tabuleiro = new TabuleiroClass()

module.exports = Tabuleiro