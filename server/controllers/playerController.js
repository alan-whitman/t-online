let nextPlayerId = 0;
players = [];

module.exports = {
    assignPlayerId() {
        console.log(`player assigned id ${nextPlayerId}`);
        return nextPlayerId++;
        client.emit('assignPlayerId', nextPlayerId++);
    },
    createPlayer() {
        const player = {
            id: nextPlayerId++,
            posx: 0
        }
    }
}