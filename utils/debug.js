function formatMessage(message) {
  return `[${new Date().toLocaleString('ru-RU').replace(', ', ' ')}] ${message}`
}

function log(message) {
  if (process.env.DEBUG !== 'true') return

  console.log(formatMessage(message))
}

function error(message) {
  console.error(formatMessage(message))
}

module.exports = {
  log,
  error
}
