// const express = require( 'express' );
require('dotenv').config();
import LocalSession from 'telegraf-session-local';
import { Telegraf } from 'telegraf'
import { BotContext, Step } from './types';
import Report from './classes/Report';
import { sessionReducer, currencyMenuMiddleware } from './utils'

const bot = new Telegraf<BotContext>(process.env.TOKEN || '')

bot.use((new LocalSession({ database: 'chats.json' })).middleware())
bot.use(currencyMenuMiddleware)

bot.start((ctx) => {
  let { startPayload } = ctx; 
  if (!startPayload) return ctx.reply('Not authotized.')

  ctx.session = { step: Step.START, authId: startPayload, report: new Report()};
  const { updatedSession, botReply} = sessionReducer(ctx);
  ctx.session = updatedSession;

  ctx.reply(botReply)
})

bot.on('text', (ctx , next) => {
  const { update: { message: { text } } } = ctx;

  if (!text) return;
  const { updatedSession, botReply} = sessionReducer(ctx, text);
  ctx.session = updatedSession;
  ctx.reply(botReply)

  return next()
})

bot.on('photo', (ctx , next) => {
  const { session: { step, report }, update: { message: { photo } } } = ctx;

  if (step !== Step.IMAGES) {
    ctx.reply('Будь-ласка, спочатку введіть опис та суму.')
    const { updatedSession, botReply} = sessionReducer(ctx);
    ctx.session = updatedSession;
    ctx.reply(botReply)

    return next()
  }

  ctx.session.report.images = [...report.images, ...photo];
  ctx.reply('Чудово!')
  ctx.session.step = Step.END;

  return next();
})

bot.on('document', (ctx , next) => {
  const { session, update: { message: { document } } } = ctx;

  if (session.step !== Step.IMAGES) {
    ctx.reply('Будь-ласка, спочатку введіть опис та суму.')
    const { updatedSession, botReply} = sessionReducer(ctx);
    ctx.session = updatedSession;
    ctx.reply(botReply)
    
    return next()
  }

  if (document.mime_type?.includes('image')) {
    ctx.session.report.images.push(document);
    ctx.reply('Чудово!')
    ctx.session.step = Step.END;
  } else {
    ctx.reply('Будь-ласка, загрузіть саме фото.')
  }

  return next();
})

bot.on('sticker', (ctx) => ctx.reply('👍'))

bot.launch()
