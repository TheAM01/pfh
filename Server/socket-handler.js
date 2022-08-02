import db from './database.js'
import session from "express-session";
import util from "./util.js";


function socketHandler (socket, io, store) {

    socket.on('db_query', async (val) => {
        let queryResults = await db.get(val);
        await io.emit('db_query_result', queryResults);
    });

    socket.on('db_post', async (obj) => {
        await db.set(obj.key, obj.val);
        io.emit('db_post', 200);
    });

    socket.on('user_validation', async (obj) => {

        if (!socket.handshake.headers.cookie) return await io.emit('user_validation', false)
        let sessionId = socket.handshake.headers.cookie.split(' ')

        sessionId = sessionId.find(c => c.startsWith("connect.sid"));

        if (!sessionId) return await io.emit('user_validation', false);

        sessionId = sessionId.replace('connect.sid=s%3A', '').split('.')[0];

        let trt = store.sessions[sessionId]

        if (!trt) {
            return await io.emit('user_validation', {authenticated: false});
        } else {
            return await io.emit('user_validation', {authenticated: true});
        }

    });

    socket.on('create_profile', )

}

export default socketHandler;