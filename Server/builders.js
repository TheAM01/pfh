import bcrypt from "bcryptjs";
import db from "./database.js";


class User {

    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = bcrypt.hashSync(password, 10)
    }

    async register () {
        console.log(this)
        if (!this.username || !this.password || !this.email) throw "Invalid credentials."
        let users = await db.get('users');
        users.push(this);
        await db.set('users', users)
    }
}

export {User};