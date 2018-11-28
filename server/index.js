const app = require('express')();
const io = require('socket.io')();
const session = require('express-session');
const massive = require('massive');
const bodyParser = require('body-parser');
const ac = require('./controllers/authController');
const sp = require('./controllers/spController');
const mc = require('./controllers/socket/mpController');
require('dotenv').config();

const { CONNECTION_STRING: cs, SOCKET_PORT: socketPort, EXPRESS_PORT: expressPort, SESSION_SECRET: ss } = process.env;

massive(cs).then(db => {
    app.set('db', db);
    console.log('db connected');
});

app.use(bodyParser.json());
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: ss,
    cookie: {
        maxAge: 99999999
    }
}));

/*
    Auth endpoints
*/

app.post('/auth/register', ac.register);
app.post('/auth/login', ac.login);
app.get('/auth/current_user', ac.currentUser);
app.get('/auth/logout', ac.logout);

/*
    SP game endpoints
*/

app.post('/sp/add_score', sp.addScore);
app.get('/sp/get_scores/:username', sp.getScores);
app.get('/sp/get_scores', sp.getScores);
app.get('/sp/leaderboard', sp.getLeaderboard);


/*
    Express Listen
*/

app.listen(expressPort, () => console.log(expressPort));


/*
    Socket stuff
*/

let roomCount = 0;

io.on('connection', client => {
    console.log('client connected');
    let myRoom;
    let roomSize;
    client.on('playMp', () => {
        myRoom = 't' + roomCount;
        client.join(myRoom);
        io.to(myRoom).clients((err, clients) => {
            if (clients.length == 2)
                roomCount++;
        });
        client.emit('roomNum', 'You are in room ' + myRoom);    
    });

    client.on('sendBoard', (board) => {
        client.to(myRoom).emit('relayBoard', board);
    });

});

io.listen(socketPort);