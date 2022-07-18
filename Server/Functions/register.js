import db from "../database.js";
import {User} from "../builders.js";


async function register (req, res) {

    const {username, email, password, grade} = req.body;
    const users = await db.get('users');
    let emailValidation = users.find(u => u.email === email);
    let usernameValidation = users.find(u => u.username === username);

    if (emailValidation) {
        return res.redirect('/register?email_exists=true');
    };

    if (usernameValidation) {
        return res.redirect('/register?username_exists=true');
    };

    let user = new User(username, email, password, grade);
    await user.register();
    res.redirect('/login?account_created=true');

};

export default register