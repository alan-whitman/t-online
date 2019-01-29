const express = require('express');
const session = require('express-session');
const massive = require('massive');
const bodyParser = require('body-parser');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, { pingTimeout: 15000, rejectUnauthorized: false });

const ac = require('./controllers/authController');
const sc = require('./controllers/settingsController');
const sp = require('./controllers/spController');
const mp = require('./controllers/mpController');
require('dotenv').config();

const { CONNECTION_STRING: cs, EXPRESS_PORT: serverPort, SESSION_SECRET: ss } = process.env;

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

app.use(express.static(`${__dirname}/../build`));

/*
    Auth endpoints
*/

app.post('/auth/register', ac.register);
app.post('/auth/login', ac.login);
app.post('/auth/verify', ac.verify);
app.post('/auth/reset_password_request', ac.resetPasswordRequest);
app.post('/auth/recover_account', ac.recoverAccount);
app.get('/auth/current_user', ac.currentUser);
app.get('/auth/logout', ac.logout);
app.get('/auth/resend_verification', ac.resendVerification);
app.put('/auth/update_email', ac.updateEmail);
app.put('/auth/update_password', ac.updatePassword)
app.delete('/auth/delete_account', ac.deleteAccount)


/*
    SP game endpoints
*/

app.post('/sp/add_score', sp.addScore);
app.get('/sp/get_scores/:username', sp.getScores);
app.get('/sp/get_scores', sp.getScores);
app.get('/sp/leaderboard', sp.getLeaderboard);

/*
    MP game endpoints
*/

app.post('/mp/update_ratings', mp.updateRatings);
app.get('/mp/rankings', mp.getRankings);

/*
    User settings endpoints
*/

app.post('/settings/update', sc.updateSettings);
app.post('/settings/blockscale', sc.updateBlockScale);

/*
    Mail endpoints
*/

// app.post('/mail/registration', mc.registration);

/*
    Express Listen
*/

// app.listen(expressPort, () => console.log(expressPort));

/*
    Socket stuff
*/

let roomCount = 0;

io.on('connection', client => {
    console.log('client connected: ' + client.id);
    let myRoom;
    let roomSize;
    client.on('playMp', (username) => {
        client.username = username;
        myRoom = 't' + roomCount;
        client.join(myRoom);
        io.to(myRoom).clients((err, clients) => {
            if (clients.length == 2) {
                let userList = clients.map(client => io.sockets.connected[client].username);
                roomCount++;
                io.in(myRoom).emit('startGame', userList);
                // if (userList[0] !== userList[1])
                //     io.in(myRoom).emit('startGame', userList);
                // else
                //     io.in(myRoom).emit('playAgainstSelf');
            }
        });
        client.emit('roomNum', 'You are in room ' + myRoom);    
    });

    client.on('sendBoard', (board) => {
        client.to(myRoom).emit('relayBoard', board);
    });

    client.on('iLost', () => {
        client.to(myRoom).emit('youWin');
    });

    client.on('sendGarbage', (garbage) => {
        client.to(myRoom).emit('relayGarbage', garbage);
    });

    client.on('disconnect', () => {
        io.to(myRoom).emit('userDisconnected')
        console.log('client disconnected: ' + client.id);
    });
});


// io.listen(socketPort);

http.listen(serverPort, () => {
    console.log(`listening on port: ${serverPort}`)
});