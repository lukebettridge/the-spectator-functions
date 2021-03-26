import fetch from 'node-fetch';
import getPreviousDataPoint from '../utils/getPreviousDataPoint';

const symbols = ['DCOILBRENTEU', 'DHHNGSP'] as const;

export type Commodities = {
    [key in typeof symbols[number]]?: {
        change?: number;
        changePercent?: number;
        price: number;
        timestamp: number;
    }[]
}

export default async (timestamp: number, commodities: Commodities = {}): Promise<Commodities> => {
    const baseUrl = process.env.IEX_CLOUD_API_URL;
    const token = process.env.IEX_CLOUD_API_TOKEN;

    for (const index in symbols) {
        const symbol = symbols[index];

        const requestUrl = `${baseUrl}/data-points/market/${symbol}?token=${token}`;
        const response = await fetch(requestUrl, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const price = await response.json();

        if (commodities[symbol]) {
            let change: number = undefined;
            let changePercent: number = undefined;

            const previousDataPoint = getPreviousDataPoint(commodities[symbol]);
            if (previousDataPoint) {
                change = price - previousDataPoint.price;
                changePercent = change / previousDataPoint.price;
            }

            commodities[symbol].unshift({ change, changePercent, price, timestamp });
        } else {
            commodities = { ...commodities, [symbol]: [{ price, timestamp }]}
        }
    }
    return commodities;
}