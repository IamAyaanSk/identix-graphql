import AWS from 'aws-sdk';

AWS.config.update({
  region: 'ap-south-1',
});

const ses = new AWS.SES();

const params = {
  Template: {
    TemplateName: 'ResetPasswordTemplate',
    SubjectPart: 'Password reset request | identix',
    HtmlPart: `<h1>Hello {{userName }}</h1>, <p>Your reset link is valid for next 1 hour: <a href="https://${process.env.DOMAIN_NAME}/password-reset?token={{token}}">Click to reset your password</a></p>`,
    TextPart: '',
  },
};

ses.createTemplate(params, (err, data) => {
  if (err) console.log(err);
  else console.log(data);
});
