import AWS, { Lambda } from 'aws-sdk';
import { S3Client } from '@aws-sdk/client-s3';
import { serverEnv } from '~/env/server';

AWS.config.update({ region: serverEnv.REGION });

export const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
  credentials: {
    accessKeyId: serverEnv.AWS_ACCESS_KEY_ID,
    secretAccessKey: serverEnv.AWS_ACCESS_KEY_SECRET,
  }
});

export const getS3Client = () => {
  return new S3Client({ region: serverEnv.REGION });
};

export const getSTS = (region: string) => {
  return new AWS.STS({ region });
};

export const getLambda = (configuration: Lambda.Types.ClientConfiguration) => {
  return new Lambda(configuration);
};
