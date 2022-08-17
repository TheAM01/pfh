import bcrypt from "bcryptjs";
import db from "./database.js";


class User {

    constructor(username, firstName, lastName, email, password, grade) {

        let normal = Math.floor(Math.random() * 10);

        this.username = username;
        this.name = `${firstName.split(' ')[0]} ${lastName.split(' ')[0]}`
        this.email = email;
        this.password = bcrypt.hashSync(password, 10)
        this.userData = {
            name: `${firstName.split(' ')[0]} ${lastName.split(' ')[0]}`,
            username: this.username,
            grade: grade,
            savedUrls: []
        }
        // console.log(normal)

        if (normal > 2) this.userData.avatar = '/cdn/default.png'
        else this.userData.avatar = `/cdn/default_${normal}.png`;

    }

    async register () {
        if (!this.username || !this.password || !this.email) throw "Invalid credentials."
        let users = await db.get('users');
        users.push(this);
        await db.set('users', users)
    }
}


class NoteSchema {

    constructor(id, name, index, grade, subject, url, source, images) {
        this.id = id;
        this.name = name;
        this.index = index;
        this.grade = grade;
        this.subject = subject;
        this.url = url;
        this.source = source;
        this.normals = images.length;
        this.images = images
        this.comments = []
    }

    async register () {
        if (!this.id) throw "No ID."
        await db.set(this.id.toLowerCase().replace(/\s/g, ""), this);
        console.log(`Successfully registered "${this.id}".`)
    }

}

class CommentSchema {

    constructor(user, comment, time, parentItem) {
        this.user = user.username;
        this.thumbnail = user.avatar;
        this.comment = comment;
        this.timestamp = time;
        this.parentItem = parentItem
    }
}

export {User, NoteSchema, CommentSchema};