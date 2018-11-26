const app = require('express')();
const session = require('express-session');
const io = require('socket.io')();
const massive = require('massive');
const bodyParser = require('body-parser');
const ac = require('./controllers/authController');
const sp = require('./controllers/spController');
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




app.listen(expressPort, () => console.log(expressPort));


// io.on('connection', (client) => {
//     console.log('a user connected');
//     client.on('requestNewPlayer', (name) => {
//         let newPlayerData = {
//             posx: 0,
//             posy: 0,
//             name,
//             id: nextPlayerId++
//         }
//         players.push(newPlayerData);
//         client.emit('sendNewPlayer', {...newPlayerData, map});
//     });
//     client.on('updatePlayerPos', (updatingPlayer) => {
//         let updatingPlayerId = players.findIndex(player => player.id === updatingPlayer.id);
//         players[updatingPlayerId] = updatingPlayer;
//         client.emit('updatePlayers', players);
//     });
//     setInterval(() => {
//         client.emit('updatePlayers', players)
//         // console.log('hi');
//     }, 100)
//     // client.on('getPlayerId', () => {
//     //     console.log('getting player id...')
//     //     client.emit('assignPlayerId', pc.assignPlayerId());
//     // })
// });

// io.listen(socketPort);