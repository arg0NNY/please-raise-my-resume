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
    debug.info('Initializing...')
    debug.await('Logging in...')
    await this.tg.login()
    debug.success('Logged in.')

    debug.await('Searching chat...')
    this.chat = await this.tg.searchPublicChat(USERNAME)
    if (!this.chat) throw new Error('Chat not found.')
    debug.success(`Chat "${this.chat.title}" found.`)

    this.tg.on('updateNewMessage', this._handleNewMessage.bind(this))
    debug.watch('Attached listener to updateNewMessage.')

    debug.await('Receiving bot menu...')
    this._awaitingMenu = true
    await this._sendMessage(Commands.MAIN_MENU)
  }

  _sendMessage (text) {
    return this.tg.sendMessage(this.chat.id, Tg.buildSimpleTextMessageContent(text))
  }

  async _handleNewMessage (data) {
    const { id, sender_id, chat_id, reply_markup } = data.message
    if (chat_id !== this.chat.id || sender_id?.user_id !== this.chat.type.user_id || reply_markup?._ !== 'replyMarkupShowKeyboard') return

    debug.info(`Received new message ${id} with keyboard attached. Processing...`)
    const commands = reply_markup.rows.flat().map(b => b.text)

    if (this._awaitingMenu) {
      this._awaitingMenu = false

      debug.info(`Bot menu received. Checking for command "${Commands.RAISE_LONG}"...`)
      if (commands.includes(Commands.RAISE_LONG)) {
        debug.info(`Command "${Commands.RAISE_LONG}" found. Sending...`)
        await this._sendMessage(Commands.RAISE_LONG)
        debug.success(`Command "${Commands.RAISE_LONG}" sent.`)
      }
      else debug.error(`Command "${Commands.RAISE_LONG}" not found.`)
    }
    if (commands.includes(Commands.RAISE_SHORT)) {
      debug.info(`Received menu with command "${Commands.RAISE_SHORT}". Sending...`)
      this._sendMessage(Commands.RAISE_SHORT)
      debug.success(`Command "${Commands.RAISE_SHORT}" sent.`)
    }

    debug.success(`Message ${id} processed successfully.`)
  }

}()
App.init().catch(debug.fatal)
