import fetch from 'node-fetch';

import { Commodities } from '../builders/commodities';
import { Crypto } from '../builders/crypto';
import { Forex } from '../builders/forex';
import { Stocks } from '../builders/stocks';

export type EconomicsData = {
    commodities?: Commodities;
    crypto?: Crypto;
    forex?: Forex;
    stocks?: Stocks;
    timestamp?: number;
}

const fetchCurrentEconomicsData = async (): Promise<EconomicsData> => {
    const baseUrl = process.env.SITE_URL;
    const objectKey = process.env.ECONOMICS_OBJECT_KEY;

    const response = await fetch(`${baseUrl}/${objectKey}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return (await response.json() || {});
}

export default fetchCurrentEconomicsData;