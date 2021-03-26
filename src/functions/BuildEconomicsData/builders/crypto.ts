import fetch from 'node-fetch';
import getPreviousDataPoint from '../utils/getPreviousDataPoint';

const symbols = ['BTCUSD', 'ETHUSD'] as const;

export type Crypto = {
    [key in typeof symbols[number]]?: {
        change?: number;
        changePercent?: number;
        price: number;
        timestamp: number;
    }[]
}

export default async (timestamp: number, crypto: Crypto = {}): Promise<Crypto> => {
    const baseUrl = process.env.ECONOMICS_API_URL;
    const token = process.env.ECONOMICS_API_TOKEN;

    for (const index in symbols) {
        const symbol = symbols[index];

        const requestUrl = `${baseUrl}/crypto/${symbol}/price?token=${token}`;
        const response = await fetch(requestUrl, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const { price } = await response.json();

        if (crypto[symbol]) {
            let change: number = undefined;
            let changePercent: number = undefined;

            const previousDataPoint = getPreviousDataPoint(crypto[symbol]);
            if (previousDataPoint) {
                change = price - previousDataPoint.price;
                changePercent = change / previousDataPoint.price;
            }

            crypto[symbol].unshift({ change, changePercent, price, timestamp });
        } else {
            crypto = { ...crypto, [symbol]: [{ price, timestamp }]}
        }
    }
    return crypto;
}