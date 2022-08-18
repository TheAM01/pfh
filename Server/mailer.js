import {SMTPClient} from "emailjs";
import fs from "fs";

const client = new SMTPClient({
    user: 'no-reply@parhlefailhojayega.ga',
    password: process.env.MAIL_PASS,
    host: 'smtp.yandex.ru',
    ssl: true,
    port: 465,
});

async function mail (subject, text, recipient) {
    try {
        const message = await client.sendAsync({
            text: text,
            from: "Parhle Fail Hojayega <no-reply@parhlefailhojayega.ga>",
            to: `${recipient.name} <${recipient.email}>`,
            subject: subject,
        });
        return message;
    } catch (err) {
        console.error(err);
    }
}


async function mailHtml (subject, text, recipient) {
    try {
        const message = await client.sendAsync({
            text: 'i hope this works',
            from: "Parhle Fail Hojayega <no-reply@parhlefailhojayega.ga>",
            to: `${recipient.name} <${recipient.email}>`,
            subject: subject,
            attachment: [
                { data: fs.readFileSync('./Public/Mail/welcome.html'), alternative: true }
            ],
        })
    } catch (err) {
        console.error(err);
    }
}

async function mailWelcome (recipient) {

    const text = `

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    </head>
    <body>
    
    Hello, ${recipient.name}! Welcome to Parhle Fail Hojayega. We hope you enjoy your stay.\n
    Here are a few steps to get you started on our website:
    
    Start looking for notes: <a href="https://parhle.ml/all">All notes</a>\n
    Visit your profile: <a href="https://parhle.ml/profile">${recipient.username}'s profile</a>\n
    Take a look at our privacy policy: <a href="https://parhle.ml/policy/privacy">Privacy policy</a>\n
    
    or you could contact us <a href="https://parhle.ml/contact">here</a>
    
    That's all! You're set to use our service now.
    </body>
    </html>
    `
    try {
        const message = await client.sendAsync({
            text: "text",
            from: "Parhle Fail Hojayega <no-reply@parhlefailhojayega.ga>",
            to: `${recipient.name} <${recipient.email}>`,
            subject: "Welcome aboard!",
            attachment: [
                { data: fs.readFileSync('./Public/Mail/welcome2.html'), alternative: true }
            ],
        });
        return message;
    } catch (err) {
        console.error(err);
    }
}

export {mailHtml, mail, mailWelcome}