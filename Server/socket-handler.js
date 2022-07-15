import db from './database.js'


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
        await io.emit(socket.request.session)
    })

}

export default socketHandler;