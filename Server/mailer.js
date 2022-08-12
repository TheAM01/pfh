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

export {mailHtml, mail}