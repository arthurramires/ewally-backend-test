function cleanDigitableLine(line) {
    line = line.replace(/( |-)/g, '');
    let newstring = line.split('.').join('');
    return newstring;
}

module.exports = {
    cleanDigitableLine
};
