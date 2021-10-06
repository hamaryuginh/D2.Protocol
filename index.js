const fs = require('fs');

const Reader = require('./src/Reader');
const Protocol = require('./lib/protocol');
const VERSION = fs.readFileSync('./VERSION', 'utf-8');

module.exports = {
    Reader,
    Protocol,
    VERSION,
};