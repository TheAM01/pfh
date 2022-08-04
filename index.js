import express from "express";
import http from "http";
import {Server} from "socket.io"
import session from 'express-session';
import bodyParser from 'body-parser'
import path from 'path';

import createRoutes from "./Server/routes.js";
import socketHandler from "./Server/socket-handler.js";
import db from './Server/database.js'
import {User} from "./Server/builders.js";

const app = express();
const server = http.createServer(app);
const dir = path.resolve()
const store = new session.MemoryStore()
const port = process.env.PORT || 3000;
const secret = process.env.COOKIE_SECRET || "moshimoshi69420"
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
const sessionMiddleware = session({
    secret: secret,
    cookie: {
        maxAge: 60 * 60 * 1000
    },
    saveUninitialized: false,
    store
});
const io = new Server(server, {
    allowRequest: (req, callback) => {
        // with HTTP long-polling, we have access to the HTTP response here, but this is not
        // the case with WebSocket, so we provide a dummy response object
        const fakeRes = {
            getHeader() {
                return [];
            },
            setHeader(key, values) {
                req.cookieHolder = values[0];
            },
            writeHead() {},
        };
        sessionMiddleware(req, fakeRes, () => {
            if (req.session) {
                // trigger the setHeader() above
                fakeRes.writeHead();
                // manually save the session (normally triggered by res.end())
                req.session.save();
            }
            callback(null, true);
        });
    },
});

io.use(wrap(sessionMiddleware));
app.use(express.static(dir + '/Public'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(sessionMiddleware)

createRoutes(app, dir, {store, io});

server.listen(port, async () => {

    console.clear()
    console.log('Initializing...')
    console.log(`Listening on port ${port}.`);
    // await onload();

});

io.engine.on("initial_headers", (headers, req) => {
    if (req.cookieHolder) {
        headers["set-cookie"] = req.cookieHolder;
        delete req.cookieHolder;
    }
});

io.on('connection', async (socket) => {
    socketHandler(socket, io, store)
});

async function onload () {


    // const chapter = {
    //     name: 'chapter 10',
    //     url: '/notes/xi/phys/10',
    //     normals: images.length,
    //     subject: 'Physics',
    //     grade: 'XI',
    //     images: images
    // };
    //
    // await db.set('xi_phys_10', chapter);
    // console.log(await db.get('xi_phys_10'))


    let maths = await db.list('xi_maths');

    maths.forEach(async stuff => {

        const item = await db.get(stuff)
        const images = item.images;

        const newItem = {
            name: item.name.replace(/\s/g, ''),
            url: item.url,
            normals: images.length,
            subject: 'Mathematics',
            grade: 'XI',
            images: images
        };

        await db.set(stuff, newItem);

    })
    // return console.log(await db.get('list_alpha'))
    //
    // let list = await db.get('list_alpha');
    // let exercises = await db.list('xi_chem');
    //
    // console.log('Initializing list creation for chem...')
    //
    // for (let i = 0; i < exercises.length; i++) {
    //
    //     let stuff = await db.get(exercises[i]);
    //
    //     list[exercises[i].replace('.', '_')] = {
    //
    //         id: exercises[i],
    //         grade: exercises[i].split('_')[0],
    //         subject: exercises[i].split('_')[1],
    //         name: stuff.name.replace(/\s/g, ""),
    //         images: stuff.normals,
    //         source: stuff.url
    //
    //     }
    // }
    // console.log(list)
    // await db.set('list_alpha', list)
}