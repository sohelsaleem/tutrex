const authGatewayFactory = require('../../datasource/auth/AuthGatewayFactory');
const mapAuthInfo = require('../../datasource/auth/AuthInfoMapper');
const RoomNotifierGateway = require('../../datasource/roomNotifier/RoomNotifierGatewayFactory')();

const userRepository = require('../repository/RepositoryRegistry').user;
const roomRepository = require('../repository/RepositoryRegistry').room;
const Room = require('../room/Room');

module.exports = {
    auth,
    login,
    logout
};

function* auth(token, tabId) {
    const authGateway = authGatewayFactory();
    const authDto = yield authGateway(token);
    return mapAuthInfo(authDto, tabId);
}

function login(userDto, roomDto) {
    const user = Object.assign({}, userDto, {
        roomId: roomDto.id
    });

    const room = getOrCreateRoom(roomDto);

    try {
        return tryLogin(room, user);
    }
    catch (error) {
        return {
            result: false,
            errorMessage: error.message
        };
    }
}

function getOrCreateRoom(roomDto) {
    const room = roomRepository.findById(roomDto.id);

    if (room) {
        room.options.classroomLogo = roomDto.classroomLogo;
        return room;
    }

    return Room.fromDto(roomDto);
}

function tryLogin(room, user) {
    room.addUser(user);

    roomRepository.put(room);
    userRepository.put(user);

    RoomNotifierGateway.markUserEnteredInRoom(user);

    return {result: true};
}

function logout(userId, roomId) {
    const user = userRepository.findById(userId);
    const room = roomRepository.findById(roomId);

    if (!room || !user)
        return;

    room.removeUser(user);

    userRepository.removeById(userId);

    RoomNotifierGateway.markUserLeftRoom(userId, roomId);
}