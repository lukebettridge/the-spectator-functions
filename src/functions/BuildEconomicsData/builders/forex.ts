import fetch from 'node-fetch';
import getPreviousDataPoint from '../utils/getPreviousDataPoint';

const symbols = ['GBPUSD', 'GBPEUR', 'GBPAUD', 'GBPJPY'] as const;

export type Forex = {
    [key in typeof symbols[number]]?: {
        change?: number;
        changePercent?: number;
        price: number;
        timestamp: number;
    }[]
}

export default async (timestamp: number, forex: Forex = {}): Promise<Forex> => {
    const baseUrl = process.env.IEX_CLOUD_API_URL;
    const token = process.env.IEX_CLOUD_API_TOKEN;

    const requestUrl = `${baseUrl}/fx/latest?token=${token}&symbols=${symbols.join(',')}`;
    const response = await fetch(requestUrl, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const responseBody = await response.json();

    responseBody.forEach(({ rate: price, symbol }) => {
        if (forex[symbol]) {
            let change: number = undefined;
            let changePercent: number = undefined;

            const previousDataPoint = getPreviousDataPoint(
                forex[symbol as typeof symbols[number]]
            );
            if (previousDataPoint) {
                change = price - previousDataPoint.price;
                changePercent = change / previousDataPoint.price;
            }

            forex[symbol].unshift({ change, changePercent, price, timestamp });
        } else {
            forex = { ...forex, [symbol]: [{ price, timestamp }] }
        }
    });
    return forex;
}