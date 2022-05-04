import { Context } from 'telegraf'

export interface BotContext extends Context {
    userName: string;
}
