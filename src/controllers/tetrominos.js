export const tetrominos = {
    T: {

    },
    I: {

    },
    O: {

    },
    L: {

    },
    J: {

    },
    S: {

    },
    Z: {
        x: 4,
        y: 22,
        shape: 'Z',
        orientation: 0
    }
}

const piece = {
    x: 0,
    y: 0,
    shape: 'Z', // T, I, O, L, J, S, Z
    orientation: 0 // 0, 1, 2, 3, initial state is 0, order is clockwise
}

export const getPieceBlocks = (piece) => {
    console.log(piece)
    const { shape, orientation, x, y } = piece;
    switch (shape) {
        case 'T':
            switch (orientation) {
                case 0:
                    return [{x, y}, {x: x -1, y}, {x, y: y + 1}, {x: x + 1, y}];
                case 1:
                    return [{x, y}, {x, y: y + 1}, {x: x + 1, y}, {x, y: y - 1}];
                case 2:
                    return [{x, y}, {x: x - 1, y}, {x, y: y - 1}, {x: x + 1, y}];
                case 3:
                    return [{x, y}, {x, y: y + 1}, {x: x - 1, y}, {x, y: y - 1}];
                default:
                    return;
            }
        case 'I':
            return;
        case 'O':
            return [{x, y}, {x: x + 1, y}, {x, y: y - 1}, {x: x + 1, y: y - 1}];
        case 'L':
            return;
        case 'J':
           return;
        case 'S':
            return;
        case 'Z':
            return;
        defaut:
            return;
    }
}