import { Context } from 'telegraf'
import Report from './classes/Report';

export enum Currency {
    UAH = 'UAH',
    USD = 'USD',
    PLN = 'PLN',
    EUR = 'EUR',
}

export enum Step {
    START = 'start',
    DESCRIPTION = 'description',
    CURRENCY = 'currency',
    AMOUNT = 'amount',
    IMAGES = 'images',
    END = 'end',
}

export interface BotContext extends Context {
    userName: string;
    session: { report: Report, step: Step, authId: string };
}
