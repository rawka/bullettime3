const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const chokidar = require('chokidar');
const folder = 'video';
const Video = require('./models/Video');
const history = require('connect-history-api-fallback');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { pingTimeout: 60000, cors: {origin: '*'} });
const watcher = chokidar.watch(folder, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    cwd: '.',
});

app.set('port', 80);
app.use(history());
app.use(cors());

httpServer.listen(app.get('port'), () => {
    console.log(`[OK] Server is running on localhost:${app.get('port')}`);
});


mongoose.connect('mongodb://localhost:27017/bullettime', { useNewUrlParser: true })
    .then(db => console.log('[OK] DB is connected'))
    .catch(err => console.error(err));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan('tiny'));
app.use('/api/', require('./routes/video'));
app.use('/', express.static(path.join(__dirname, '../dist')));
app.use('/video', express.static(path.join(__dirname, '../video')));

watcher.on('add', path => {
    setTimeout(() =>{
        const name = path.replace("video\\","");
        path = path.replace("\\", "/");
        Video.findOne({name:name}, function (err, res) {
            if (err) return console.log(err)
            if (res) {
                console.log("DUPLICATE "+res.name)
            } else {
                const video = new Video({name: name, path: path})
                video.save(function (err) {
                    if (err) return console.log(err)
                })
                io.emit('add_video',video)
            }
        })
    }, 7000)
});

io.on("connection", (socket) => {
    console.log("connected")
    socket.on('publish', async (id) => {
        let result = await Video.findById(id)
        socket.broadcast.emit('published', result)
    })
    socket.on('unpublish', async (id) => {
        socket.broadcast.emit('unpublished', id)
    })
    socket.on('delete', (id) => {
        socket.broadcast.emit('deleted', id)
    })
});



