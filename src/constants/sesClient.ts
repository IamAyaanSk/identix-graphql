import { SES } from '@aws-sdk/client-ses';

const SES_CLIENT = new SES({ region: 'ap-south-1' });

export { SES_CLIENT };
