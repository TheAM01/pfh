import db from './database.js'
import util from "./util.js";
import * as Console from "console";

String.prototype.capitalizeInitial = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}


function socketHandler (socket, io, store) {

    const req = socket.request

    socket.on('db_query', async (val) => {
        let queryResults = await db.get(val);
        await io.to(socket.id).emit('db_query_result', queryResults);
    });

    socket.on('db_post', async (obj) => {
        await db.set(obj.key, obj.val);
        io.to(socket.id).emit('db_post', 200);
    });

    socket.on('user_validation', async (obj) => {

        if (!socket.handshake.headers.cookie) return await io.to(socket.id).emit('user_validation', false)
        let sessionId = socket.handshake.headers.cookie.split(' ')

        sessionId = sessionId.find(c => c.startsWith("connect.sid"));

        if (!sessionId) return await io.to(socket.id).emit('user_validation', false);

        sessionId = sessionId.replace('connect.sid=s%3A', '').split('.')[0];

        let trt = store.sessions[sessionId]

        if (!trt) {
            return await io.to(socket.id).emit('user_validation', {authenticated: false});
        } else {
            return await io.to(socket.id).emit('user_validation', {authenticated: true});
        }

    });

    socket.on('request_file', async (data) => {

        const item = await db.get(`${data.grade}_${data.subject}_${data.index}`)

        const heading = `${item.grade.toUpperCase()} ${item.subject.capitalizeInitial()} ${item.name.replace(/_/g, ' ').capitalizeInitial()}` // create standardized heading

        const person = await util.checkPerson(req); // get the session user
        let includes

        if (!person) includes = null // if no user, return null
        else includes = !!person.savedUrls.find(u => u.title === heading); // check if person has saved this url

        io.to(socket.id).emit('request_file', {item, includes});

    });

    socket.on('create_profile', async () => {

        const person = await util.checkPerson(req);

        if (!person) return io.to(socket.id).emit("create_profile",
            {
                username: "John Doe",
                grade: "grade_NaN",
                avatarUrl: "/cdn/default.png",
                savedUrls: [
                    {title: "XI Chemistry Chapter 1", url: "/notes/xi/chem/1"}
                ]
            }
        );

        io.to(socket.id).emit("create_profile", person)

    }).setMaxListeners(0);

    socket.on('save_post', async (data) => {

        if (!req.session.user) return io.to(socket.id).emit('save_post', 400);

        const person = await util.checkPerson(req);

        person.savedUrls.push(data);

        await util.updatePerson(person)

        io.to(socket.id).emit('save_post', 200);

    });

    socket.on('unsave_post', async (data) => {

        if (!req.session.user) return io.to(socket.id).emit('unsave_post', 400);

        const person = await util.checkPerson(req);

        person.savedUrls = person.savedUrls.filter(e => {
            return e.title !== data.title;
        })

        await util.updatePerson(person)

        io.to(socket.id).emit('unsave_post', 200);

    });

    socket.on('add_comment', (data) => {
        console.log(data)
    })

    socket.on('test', () => {
        io.to(socket.id).emit('yes')
    });

}

export default socketHandler;