const io = require('socket.io')();
const express = require('express');
const port = 4800;
const pc = require('./controllers/playerController');
const sc = require('./controllers/serverController');
const app = express();

const map = sc.generateMap();

let nextPlayerId = 0;
let players = [];

app.use(express.static('build'));

app.listen(3800);

io.on('connection', (client) => {
    console.log('a user connected');
    client.on('requestNewPlayer', (name) => {
        let newPlayerData = {
            posx: 0,
            posy: 0,
            name,
            id: nextPlayerId++
        }
        players.push(newPlayerData);
        client.emit('sendNewPlayer', {...newPlayerData, map});
    });
    client.on('updatePlayerPos', (updatingPlayer) => {
        let updatingPlayerId = players.findIndex(player => player.id === updatingPlayer.id);
        players[updatingPlayerId] = updatingPlayer;
        client.emit('updatePlayers', players);
    });
    setInterval(() => {
        client.emit('updatePlayers', players)
        // console.log('hi');
    }, 100)

    // client.on('getPlayerId', () => {
    //     console.log('getting player id...')
    //     client.emit('assignPlayerId', pc.assignPlayerId());
    // })
});

io.listen(port);