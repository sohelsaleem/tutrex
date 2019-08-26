const MemoryRepository = require('../../datasource/repository/MemoryRepository');

module.exports = {
    user: new MemoryRepository(),
    room: new MemoryRepository()
};

