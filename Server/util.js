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

    if (!user) return null

    let person = users.find(u => bcrypt.compareSync(u.email, user));

    return person.userData

}

async function checkPersonByEmail (email) {

    const users = await db.get('users');

    if (!email) return null

    let person = users.find(u => bcrypt.compareSync(u.email, email));

    return person.userData

}

async function updatePerson(newUserData) {

    const users = await db.get('users');

    const user = users.find(u => u.username === newUserData.username);

    if (!user) return null

    user.userData = newUserData;

    await db.set('users', users)

}

export default {
    checkAuth,
    checkPerson,
    updatePerson,
    checkPersonByEmail
}