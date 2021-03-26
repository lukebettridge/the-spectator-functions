import { S3 } from 'aws-sdk';
import { Readable } from 'stream';

type S3UploadOptions = {
    contentType?: string;
}

export const upload = async (
    bucket: string, 
    content: string,
    objectKey: string,
    options?: S3UploadOptions
): Promise<S3.ManagedUpload.SendData> => {
    const fileStream = new Readable();
    fileStream._read = () => {};
    fileStream.push(content);
    fileStream.push(null);

    const params: S3.PutObjectRequest = {
        Body: fileStream,
        Bucket: bucket,
        Key: objectKey
    }
    if (options && options.contentType) {
        params.ContentType = options.contentType
    }

    const s3 = new S3({ region: 'eu-west-2' });
    return await s3.upload(params).promise();
}