const letras = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'L', 'M', 'N', 'O', 'P', ]

function gerarLinha (exibirNumeros = false) {
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

function gerarLinhaAlfa(letra) {
    let linha = ''

    linha = `${letra} |`

    letras.map((letra, pos) => {
        pos = pos + 1

        linha += '      |'
    })

    console.log(linha)
}


class Tabuleiro {
  gerar () {
      gerarLinha(true)

      letras.map(letra => {
          gerarLinha()
          gerarLinhaAlfa(letra)
      })

      gerarLinha()
  }
}

module.exports = new Tabuleiro()