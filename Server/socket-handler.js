import db from './database.js'

async function socketHandler (socket, io, store) {

    socket.on('db_query', async (val) => {
        let queryResults = await db.get(val);
        io.emit('db_query', queryResults);
    });

    socket.on('db_post', async (obj) => {
        await db.set(obj.key, obj.val);
        io.emit('db_post', 200);
    });

    socket.on('user_validation', async (obj) => {
        console.log(store.sessions)
    })

}

export default socketHandler;