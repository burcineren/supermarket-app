export interface ExchangeRates {
    rates: {
      [key: string]: number;
    };
    base: string;
    date: string;
  }