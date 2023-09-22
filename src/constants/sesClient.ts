import AWS from 'aws-sdk';

AWS.config.update({ region: 'ap-south-1' });

const SES_CLIENT = new AWS.SES();

export { SES_CLIENT };
