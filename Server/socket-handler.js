import db from './database.js'
import session from "express-session";


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
        let sessionId = socket.handshake.headers.cookie.split(' ')[1]
            .replace('connect.sid=s%3A', '')
            .split('.')[0];

        let trt = store.sessions[sessionId]

        if (!trt) {
            return await io.emit('user_validation', false);
        } else {
            return await io.emit('user_validation', true);
        }
    })

}

export default socketHandler;