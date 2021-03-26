import 'source-map-support/register';

import { Handler, ScheduledEvent } from 'aws-lambda';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { middyfy } from '@libs/lambda';
import { upload } from '@libs/s3';

import { buildCommodities, buildCrypto, buildForex, buildStocks } from './builders';
import fetchEconomicsHub from './utils/fetchEconomicsHub';
import fetchCurrentEconomicsData from './utils/fetchCurrentEconomicsData';

const BuildEconomicsData: Handler<ScheduledEvent, ManagedUpload.SendData> = async () => {
  const timestamp = Date.now();

  // Only build stocks with symbols set in ContentStack
  const { stocks } = await fetchEconomicsHub();

  // Use current economic data to calculate change
  const { commodities, crypto, forex } = await fetchCurrentEconomicsData();

  const data = {
    commodities: await buildCommodities(timestamp, commodities),
    crypto: await buildCrypto(timestamp, crypto),
    forex: await buildForex(timestamp, forex),
    stocks: await buildStocks(timestamp, stocks),
    timestamp
  }

  const bucket = process.env.BUCKET_NAME;
  const objectKey = process.env.ECONOMICS_OBJECT_KEY;
  return upload(bucket, JSON.stringify(data), objectKey, {
    contentType: 'application/json'
  });
}

export const main = middyfy(BuildEconomicsData);
