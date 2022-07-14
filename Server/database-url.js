import fetch from 'node-fetch'
import fs from 'fs'


async function databaseUrlFetch() {

    let request, text;

    try {

        request = await fetch(
            'https://PWFH.theam02.repl.co/database_url',
            {
                headers: {
                    auth_key: "be00ec32ea3e0accf8593d9edbaf7593d28c9b55931b193b52829589e47c548b"
                }
            }
        );

        text = await request.text();
        if (!text.startsWith('http')) throw "Catch it!"
        await fs.writeFile('./Replit-db-url.txt', text, () => {});
        return text;

    } catch (err) {

        return fs.readFileSync('./Replit-db-url.txt')

    }

}

export default databaseUrlFetch;