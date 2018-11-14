export const convertNumToClass = (num) => {
    const styleMap = {
        0: 'empty-block',
        1: 'red-block',
        2: 'green-block',
        3: 'blue-block',
        4: 'silver-block',
        5: 'yellow-block',
        6: 'purple-block',
        7: 'light-blue-block',
        9: 'black-block'
    };
    return styleMap[num];
}