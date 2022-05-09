import { PhotoSize, Document } from 'telegraf/types';
import { Currency } from '../types'

export default class Report {
    description: string;
    currency: Currency;
    amount: string;
    images: Array<PhotoSize | Document>;
    constructor() {
        this.description = '';
        this.currency = Currency.UAH;
        this.amount = '';
        this.images = [];
    }

    reset() {
        this.description = '';
        this.currency = Currency.UAH;
        this.amount = '';
        this.images = [];
    }
}