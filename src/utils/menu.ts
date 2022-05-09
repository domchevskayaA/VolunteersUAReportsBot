import { BotContext, Currency, Step } from '../types'
import { MenuTemplate, MenuMiddleware } from 'telegraf-inline-menu'

const menuTemplate = new MenuTemplate<BotContext>(() => `Виберіть валюту.`)

Object.entries(Currency).forEach(([key, value], index) => {
    menuTemplate.interact(value, value, {
        joinLastRow: index != 0,
        do: async ctx => {
            ctx.session.report.currency = value;
            ctx.session.step = Step.AMOUNT
            await ctx.reply(`Чудово! Ви вибрали ${value}. Тепер введіть суму, яку ви витратили.`)
            return false
        }
    })
  })

const currencyMenuMiddleware = new MenuMiddleware('/', menuTemplate)

export default currencyMenuMiddleware;