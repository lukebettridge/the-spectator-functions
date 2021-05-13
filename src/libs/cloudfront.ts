import { CloudFront } from 'aws-sdk';

const hash = (paths: string[]) => {
    const combined = paths.join('');
    let hashValue = 0;

    for (let i = 0; i < combined.length; i++) {
        hashValue += combined.charCodeAt(i) << (i * 8);
    }
    return hashValue;
};

export const invalidate = async (paths: string[]): Promise<CloudFront.CreateInvalidationResult> => {
    const distributionId = process.env.DISTRIBUTION_ID;

    const cloudfront = new CloudFront({ region: 'eu-west-2' });
    return await cloudfront.createInvalidation({
        DistributionId: distributionId,
        InvalidationBatch: {
            CallerReference: `invalidate-${Math.round(+new Date()/1000)}-${hash(paths)}`,
            Paths: {
                Quantity: paths.length,
                Items: paths
            }
        }
    }).promise();
}