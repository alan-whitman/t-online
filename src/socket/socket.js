import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:4800');

export const requestNewPlayer = (name, cb) => {
    socket.on('sendNewPlayer', newPlayerData => cb(null, newPlayerData))
    socket.emit('requestNewPlayer', name);
}

export const updatePlayerPos = (player) => {
    socket.emit('updatePlayerPos', player);
}

export const updatePlayers = (cb) => {
    socket.on('updatePlayers', players => {
        cb(null, players);
    });
}