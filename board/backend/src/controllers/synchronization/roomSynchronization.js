const RoomRepository = require('../../domain/repository/RepositoryRegistry').room;
const allSynchronizators = require('./allSynchronizators');

module.exports = function (socketClientTable) {
    const synchronizators = makeSynchronizators(socketClientTable);

    RoomRepository
        .on('added', registerSynchronizators)
        .on('removed', unregisterSynchronizators);

    function registerSynchronizators(room) {
        synchronizators.forEach(s => s.register(room));
    }

    function unregisterSynchronizators(room) {
        synchronizators.forEach(s => s.unregister(room));
    }
};

function makeSynchronizators(socketClientTable) {
    return allSynchronizators.map(Synchronizator => {
        const synchronizator = new Synchronizator();
        synchronizator.socketClientTable = socketClientTable;
        return synchronizator;
    });
}
