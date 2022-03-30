function cleanDigitableLine(line) {
    line = line.replace(/( |-)/g, '');
    return line.replaceAll('.', '');
}

module.exports = {
    cleanDigitableLine
};
