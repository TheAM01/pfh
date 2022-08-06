import db from "../database.js";
import bcrypt from "bcryptjs";


async function login (req, res, ext) {

    const {email, password} = req.body;

    if (!email || !password) return res.redirect('/login?invalid_credentials=true'); //truthy

    const users = await db.get('users')

    const person = users.find(u => u.email === email)

    if (req.session.authenticated) {

        req.session.user = bcrypt.hashSync(email, 10);
        req.session.username = person.username
        // res.json(req.session); // bro is authy;
        req.session.authenticated = true;
        res.redirect('/home?unnecessary_login=true')

    } else {

        if (await authy(email, password)) {

            req.session.user = bcrypt.hashSync(email, 10);
            req.session.username = person.username
            req.session.authenticated = true;
            res.redirect('/home');

        } else {
            res.redirect('/login?wrong_password=true')
        }
    }

}

async function authy (email, pass) {
    const users = await db.get('users');

    const user = users.find(u => u.email === email);
    if (!user) return false;

    if ((user.email === email &&
        bcrypt.compareSync(pass, user.password))) return true;

}

export default login