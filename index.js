console.log('BATALHA NAVAL')
console.log()

const letras = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'L', 'M', 'N', 'O', 'P', ]

function gerarTabuleiro () {
    gerarLinhaTabuleiro(true)

    letras.map(letra => {
        gerarLinhaTabuleiro()
        gerarLinhaAlfaTabuleiro(letra)
    })

    gerarLinhaTabuleiro()
}

function gerarLinhaTabuleiro (exibirNumeros = false) {
    let linhaRenderizada = '   '

    letras.map((letra, pos) => {
        pos++

        if (exibirNumeros) {
            const posStr = `${pos}`.padStart(2, ' ')

            linhaRenderizada += `  ${posStr}  |`
        }
        else {
            linhaRenderizada += '-------'
        }
    })

    console.log(linhaRenderizada)
}

function gerarLinhaAlfaTabuleiro(letra) {
    let linha = ''

    linha = `${letra} |`

    letras.map((letra, pos) => {
        pos = pos + 1

        // if (pos < 10) {
        //     linha += ' '
        // }

        linha += '      |'
    })

    console.log(linha)
}

gerarTabuleiro()