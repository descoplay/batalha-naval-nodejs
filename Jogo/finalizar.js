const Tela = require('../Tela')

module.exports = (_vitorioso, _perdedor) => {
    Tela.clear()

    console.log(`Todas as peças do jogador ${_perdedor} foram afundadas`)
    console.log(`A vitória é do Jogador ${_vitorioso}!\n`)
}