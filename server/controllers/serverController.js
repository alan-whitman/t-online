module.exports = {
    generateMap() {
        const mapHeight = 30;
        const mapWidth = 30;
        console.log('generating map...');
        let mapGrid = [];
        let rand = 0;
        for (let column = 0; column < mapHeight; column++) {
            mapGrid[column] = [];
            for (let row = 0; row < mapWidth; row++) {
                rand = Math.random() * 100;
                mapGrid[column][row] = rand < 10 ? 1 : 0;
            }
        }
        return mapGrid;
    }
}