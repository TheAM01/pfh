import db from "../database.js";
import {User} from "../builders.js";
// import {mail, mailHtml} from "../mailer.js";


async function register (req, res) {

    const {username, first_name, last_name, email, password, password_confirm, grade} = req.body;

    if (!username || !first_name || !last_name || !email || !password|| !password_confirm || !grade) {
        return res.redirect('/register?incomplete_form=true')
    }

    const users = await db.get('users');
    let emailValidation = users.find(u => u.email === email);
    let usernameValidation = users.find(u => u.username === username);

    if (emailValidation) {
        return res.redirect('/register?email_exists=true');
    };

    if (usernameValidation) {
        return res.redirect('/register?username_exists=true');
    };

    if (password.length < 8) {
        return res.redirect('/register?unsafe_password=true')
    }

    if (password !== password_confirm) {
        return res.redirect('/register?unmatched_passwords=true')
    }

    let user = new User(username, first_name, last_name, email, password, grade);
    await user.register();
    res.redirect('/login?account_created=true');

    // await mailHtml("Welcome aboard!", "Welcome to Parhle Fail Hojayega. We hope you enjoy your stay.", {name: username, email: email})

};

export default register