const tdl = require('tdl')
const { getTdjson } = require('prebuilt-tdlib')
tdl.configure({ tdjson: getTdjson() })

module.exports = class Tg {

  static buildSimpleTextMessageContent (text) {
    return {
      _: 'inputMessageText',
      text: {
        _: 'formattedText',
        text
      }
    }
  }

  constructor (opts) {
    this.client = tdl.createClient(opts)
    this.client.on('update', this._handleUpdate.bind(this))
    this._listeners = []
  }

  login () {
    return this.client.login()
  }

  invoke (method, data) {
    return this.client.invoke({ _: method, ...data })
  }
  searchPublicChat (username) {
    return this.invoke('searchPublicChat', { username })
  }
  sendMessage (chatId, message_content, data = {}) {
    return this.invoke('sendMessage', { chat_id: chatId, input_message_content: message_content, ...data })
  }

  _handleUpdate (data) {
    this._listeners.forEach(l => l.event === data._ && l.fn(data))
  }
  on (event, fn) {
    this._listeners.push({ event, fn })
  }
  off (event, fn) {
    this._listeners = this._listeners.filter(l => l.event !== event || l.fn !== fn)
  }

}
