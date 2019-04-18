module.exports = tiposPeca => {
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