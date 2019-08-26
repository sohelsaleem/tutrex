'use strict';

module.exports = function() {
    if (config.simpleRoomNotifier)
        return require('./SimpleRoomNotifierGateway');

    return require('./RoomNotifierGateway');
};
