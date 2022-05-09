
import { BotContext, Step, Currency } from '../types';
import currencyMenuMiddleware from './menu'

const sessionReducer = (ctx: BotContext, userReply?: string):
{ updatedSession: BotContext['session'], botReply: string } => {
    const { session } = ctx;
    const updatedSession = {...session}
    let botReply = '';

    switch(session.step) {
      case(Step.START): {
        session.step = Step.DESCRIPTION;
        botReply = `Вітаю у чаті з VolunteersUAReportsBot!
Цей бот допоможе вам створити репорти, які згодом з'являться у вашому профілі.
Будь-ласка, вкажіть назву вашого репорту.`;
      }
      case(Step.DESCRIPTION): {
        if (!userReply || userReply.length < 5) {
          botReply = 'Будь-ласка, вкажіть достовірній опис.'
          break;
        }
        updatedSession.report.description = userReply;
        updatedSession.step = Step.CURRENCY
        // Open currency menu
        currencyMenuMiddleware.replyToContext(ctx)
        break;
      }
    //   case(Step.CURRENCY): {
    //     if (!userReply) botReply = 'Будь-ласка, виберіть валюту.'
    //     updatedSession.report.currency = userReply as Currency;
    //     updatedSession.step = Step.AMOUNT
    //     botReply = 'Введіть суму.'
    //     break;
    //   }
      case(Step.AMOUNT): {
        if (!userReply || !isFinite(Number(userReply))) botReply = 'Сума має бути число більше нуля.'
        updatedSession.report.amount = userReply as Currency;
        updatedSession.step = Step.IMAGES
        botReply = `Так тримати! Теперь завантажте фото чеку та того, що ви купили.
Фото чеку обов'язкове для верифікації репорту. Максимум 5 фото.`
        break;
      }
//       case(Step.IMAGES): {
//         if (!userReply) {
//           botReply = 'Будь-ласка, завантажте фото.'
//           break;
//         }
//         updatedSession.report.images = [userReply];
//         updatedSession.step = Step.END
//         botReply = `Дякую! Ваш репорт з'явиться у вашому профілі після верифікації.
// Також ви можете видалити репорт протягом години.`
//         break;
//       }
    case(Step.END): {
        updatedSession.step = Step.START;
        botReply = 'Ваш репорт вже збережено. Бажаєте створити новий?'
    }
      default: {
        botReply = 'Щось не так.'
      }
    }
    return { updatedSession, botReply }
  }

  export default sessionReducer;
