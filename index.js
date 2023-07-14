require('dotenv').config()
const Tg = require('./modules/tg')
const { USERNAME, Commands } = require('./data')
const debug = require('./utils/debug')
const { debounceBoolean } = require('./utils/debounce')

const App = new class {

  constructor () {
    this.tg = new Tg({
      apiId: +process.env.API_ID,
      apiHash: process.env.API_HASH,
      verbosityLevel: 0
    })
    Object.defineProperty(this, '_awaitingMenu', debounceBoolean(5000))
  }

  async init () {
    debug.log('Initializing...')
    debug.log('Logging in...')
    await this.tg.login()
    debug.log('Successfully logged in.')

    debug.log('Searching chat...')
    this.chat = await this.tg.searchPublicChat(USERNAME)
    if (!this.chat) throw new Error('Chat not found.')
    debug.log(`Chat "${this.chat.title}" found.`)

    this.tg.on('updateNewMessage', this._handleNewMessage.bind(this))
    debug.log('Attached listener to updateNewMessage.')

    debug.log('Receiving bot menu...')
    this._awaitingMenu = true
    await this._sendMessage(Commands.MAIN_MENU)
  }

  _sendMessage (text) {
    return this.tg.sendMessage(this.chat.id, Tg.buildSimpleTextMessageContent(text))
  }

  async _handleNewMessage (data) {
    const { id, sender_id, chat_id, reply_markup } = data.message
    if (chat_id !== this.chat.id || sender_id?.user_id !== this.chat.type.user_id || reply_markup?._ !== 'replyMarkupShowKeyboard') return

    debug.log(`Received new message ${id} with keyboard attached. Processing...`)
    const commands = reply_markup.rows.flat().map(b => b.text)

    if (this._awaitingMenu) {
      this._awaitingMenu = false

      debug.log('Bot menu received. Checking for RAISE_LONG command...')
      if (commands.includes(Commands.RAISE_LONG)) {
        debug.log('RAISE_LONG command found. Sending...')
        await this._sendMessage(Commands.RAISE_LONG)
        debug.log('RAISE_LONG command sent.')
      }
      else debug.error('RAISE_LONG command not found.')
    }
    if (commands.includes(Commands.RAISE_SHORT)) {
      debug.log('Received menu with RAISE_SHORT command. Sending...')
      this._sendMessage(Commands.RAISE_SHORT)
      debug.log('RAISE_SHORT command sent.')
    }

    debug.log(`Message ${id} processed successfully.`)
  }

}()
App.init().catch(debug.error)
