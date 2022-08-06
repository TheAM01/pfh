import bcrypt from "bcryptjs";
import db from "./database.js";


class User {

    constructor(username, email, password, grade) {

        let normal = Math.floor(Math.random() * 10);

        this.username = username;
        this.email = email;
        this.password = bcrypt.hashSync(password, 10)
        this.userData = {
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

    constructor(id, grade, subject, index, images, url) {
        this.id = id
        this.title = index;
        this.subject = subject;
        this.grade = grade;
        this.normals = images.length;
        this.images = images
        this.url = url;
        this.comments = []
    }

    async register () {
        if (!this.id) throw "No ID."
        await db.set(this.id.toLowerCase().replace(/\s/g, ""), this)
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