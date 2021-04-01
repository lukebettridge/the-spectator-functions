import fetch from 'node-fetch';

type EconomicsHub = {
    stocks: string[];
}

const parseEconomicsHub = (data: any): EconomicsHub => {
    let stocks: string[] = [];

    if (data) {
        stocks = data.stocks || [];
    }
    return { stocks }
}

const fetchEconomicsHub = async (): Promise<EconomicsHub> => {
    const baseUrl = process.env.CONTENTSTACK_API_URL;
    const environment = process.env.CONTENTSTACK_API_ENVIRONMENT;
    const key = process.env.CONTENTSTACK_API_KEY;
    const secret = process.env.CONTENTSTACK_API_SECRET;

    const response = await fetch(`${baseUrl}/content_types/economics_hub/entries?environment=${environment}`, {
        headers: {
            api_key: key,
            access_token: secret
        }
    });
    const data = await response.json();

    if (data && data.entries && data.entries[0]) {
        return parseEconomicsHub(data.entries[0]);
    }
    throw new Error();
}

export default fetchEconomicsHub;