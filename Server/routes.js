import login from "./Functions/login.js";

function routes (app, dir, ext) {

    app.get('/', (req, res, next) => {
        res.cookie('Foo', 'bar')
        res.sendFile(dir + '/Public/home.html')
    });

    app.get('/home', (req, res) => {
        res.sendFile(dir + '/Public/home.html')
    });

    app.get('/template', (req, res) => {
        if (req.query.override !== 'true') return res.render('not-found')
        res.sendFile(dir + '/Public/template.html')
    });

    app.get('/all', (req, res) => {
        res.sendFile(dir + '/Public/all.html')
    });

    app.get('/login', (req, res) => {
        res.sendFile(dir + '/Public/login.html');
    })

    app.post('/login', (req, res) => {
        login(req, res, ext)
    })

    app.use((req, res, next) => {
        res.status(404);
        res.sendFile(dir + '/Public/not-found.html')
    });

}

export default routes