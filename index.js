import express from "express";
import http from "http";
import {Server} from "socket.io"
import session from 'express-session';
import bodyParser from 'body-parser'
import path from 'path';

import createRoutes from "./Server/routes.js";
import socketHandler from "./Server/socket-handler.js";
import db from './Server/database.js'
import {NoteSchema, User} from "./Server/builders.js";
// import {mail, mailHtml} from "./Server/mailer.js"

const app = express();
const server = http.createServer(app);
const dir = path.resolve()
const store = new session.MemoryStore()
const port = process.env.PORT || 3000 || 3003;
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
    // await onload()

    // await mailHtml("Welcome aboard!", "Welcome to Parhle Fail Hojayega. We hope you enjoy your stay.", {name: 'username', email: 'abdulmueedofficial@gmail.com'})

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

    //
    const list = await db.get('list_theta');
    const physList = await db.list('xi_phys');
    physList.sort(function(a,b) {
        return parseInt(a.split('_')[2]) - parseInt(b.split('_')[2])
    })

    for (let i=0; i<physList.length; i++) {
        if (physList[i].includes(' ')) continue;
        if (physList[i].includes('1') && !physList[i].includes('0')) continue

        const item = await db.get(physList[i]);

        console.log(i)

        list.push(
            {
                id: item.id,
                grade: item.grade,
                subject: item.subject,
                name: item.name,
                images: item.normals,
                source: item.source,
                url: item.url,
                index: item.index
            }
        )
    }
    console.log(list)
    await db.set('list_theta', list)

}

//TODO: Add mailing service ("https://replit.com/@TheAM01/urban-dictionary-test/"); [Password: "babyimarenegade"];
//TODO: Add forgot password system;