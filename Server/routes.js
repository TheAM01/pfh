import login from "./Functions/login.js";
import writePost from "./Functions/create-post.js";
import register from './Functions/register.js'

function routes (app, dir, ext) {

    dir += '/Public/'

    app.get('/', (req, res, next) => {
        console.log(req.session)
        res.sendFile(dir + 'Static/home.html')
    });

    app.get('/home', (req, res) => {
        res.sendFile(dir + 'Static/home.html')
    });

    app.get('/template', (req, res) => {
        if (req.query.override !== 'true') return res.sendFile(dir + 'Static/not-found.html')
        res.sendFile(dir + 'Static/template.html')
    });

    app.get('/all', (req, res) => {
        res.sendFile(dir + 'Static/all.html')
    });

    app.get('/login', (req, res, next) => {
        res.sendFile(dir + 'User/login.html');
        if (req.query.wrong_password === "true") {
            ext.io.emit('wrong_password')
        }
    })

    app.get('/register', (req, res) => {
        res.sendFile(dir + 'User/register.html');
    })

    app.post('/login', async (req, res) => {
        await login(req, res, ext)
    });

    app.post('/register', async (req, res) => {
        await register(req, res);
    })

    // app.post('/write', (req, res) => {
    //     writePost(req.body.postname, req.body.postdescription, req.body.posturl);
    //     res.sendStatus(200)
    // });

    app.use((req, res) => {
        res.status(404);
        res.sendFile(dir + 'Static/not-found.html')
    });

}

export default routes