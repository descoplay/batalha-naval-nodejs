const clear = require('./clear')

const Pecas = require('./Pecas')

clear()

Promise.resolve()
    .then(() => {
        return Pecas.setPos()
    })