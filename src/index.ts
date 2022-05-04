import { Telegraf } from 'telegraf'
import { BotContext } from './types';


const bot = new Telegraf<BotContext>(process.env.TOKEN || '')

// Register middleware and launch your bot as usual
bot.use((ctx, next) => {
    const { chat } = ctx;
    // Bot should work only in private chats.
    if (!chat || chat.type !== 'private') {
        return;
    }
    const userName = chat.first_name;
    ctx.userName = userName;
    return next()
  })

bot.on('text', (ctx) => {  
    // Using context shortcut
    ctx.reply(`Hello ${ctx.userName}`)
  })