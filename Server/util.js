import db from "./database.js";
import bcrypt from "bcryptjs";

function checkAuth (req, store) {

    let user = req.session.user;
    let cachedUsers = store.sessions;

    if (!user) return false;

    return JSON.parse(cachedUsers[req.sessionID]).user === req.session.user;

}

async function checkPerson (req) {

    const users = await db.get('users');

    let user = req.session.user;

    if (!user) return undefined

    let person = users.find(u => bcrypt.compareSync(u.email, user));

    return person.userData

}

export default {
    checkAuth,
    checkPerson
}