const clear = require('./clear')

class Tela {
    constructor () {
        this.linhas = []
    }

    set (_conteudo, _linha) {
        if (!_linha) {
            this.linhas.push(_conteudo)

            return this
        }

        const linha = _linha -1

        if (this.linhas[linha]) {
            this.linhas[linha] += _conteudo
        }
        else {
            this.linhas[linha] = _conteudo
        }

        return this
    }

    setArray (_array, _linha, _espacamento) {
        let linha = _linha

        _array.map(conteudo => {
            conteudo = ''.padStart(_espacamento) + conteudo

            this.set(conteudo, linha)

            if (linha) {
                linha++
            }
        })

        return this
    }

    renderizar () {
        clear()
        console.log(this.linhas.join('\n'))

        this.linhas = []

        return this
    }

    clear () {
        clear()
    }
}

module.exports = new Tela()