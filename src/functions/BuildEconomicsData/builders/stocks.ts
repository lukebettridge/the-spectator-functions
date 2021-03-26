import fetch from 'node-fetch';

export type Stocks = {
    [key: string]: {
        change: number | undefined;
        changePercent: number | undefined;
        companyName: string | undefined;
        price: number | undefined;
        timestamp: number;
    }[]
}

export default async (timestamp: number, symbols: string[]): Promise<Stocks> => {
    let stocks: Stocks = {};

    if (!symbols.length) {
        return stocks;
    }

    const baseUrl = process.env.IEX_CLOUD_API_URL;
    const token = process.env.IEX_CLOUD_API_TOKEN;

    const requestUrl = `${baseUrl}/stock/market/batch?token=${token}&symbols=${symbols.join(',')}&types=quote`;
    const response = await fetch(requestUrl, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const responseBody = await response.json();
    Object.keys(responseBody).forEach(key => {
        const quote = responseBody[key].quote;
        if (quote) {
            stocks = {
                ...stocks, 
                [key]: [{
                    change: quote.change,
                    changePercent: quote.changePercent,
                    companyName: quote.companyName,
                    price: quote.latestPrice,
                    timestamp
                }]
            }
        }
    })

    return stocks;
}