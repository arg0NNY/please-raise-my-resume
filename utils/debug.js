const { Signale } = require('signale')

const signale = new Signale({ logLevel: process.env.DEBUG === 'true' ? 'info' : 'warn' })
signale.config({ displayTimestamp: true })

module.exports = signale
