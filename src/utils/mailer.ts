import nodemailer from 'nodemailer';

export async function sendLoginEmail({
  email,
  url,
  token,
}: {
  email: string;
  url: string;
  token: string;
}) {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <j.doe@example.com>',
    to: email,
    subject: 'Hello ✔, Login to your account',
    html: `<b>Hello world? Login <a href="${url}/login#token=${token}">HERE</a> </b>`,
  });

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
