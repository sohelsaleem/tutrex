'use strict';

const UserHelper = require('./helpers/UserHelper');

module.exports = function (listenMessage) {
    listenMessage('attendeeList:all', getAttendeeList);
    listenMessage('attendeeList:changeMediaState', changeMediaState);
    listenMessage('attendeeList:changeCapabilities', changeCapabilities);
    listenMessage('attendeeList:kick', kickAttendee);
    listenMessage('attendeeList:raiseHand', raiseHand);
};

function* getAttendeeList(client, message, responseChannel) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();

    const attendeeList = room.getAttendeeList();
    const userList = attendeeList.getList();

    responseChannel.sendAnswer(userList);
}

function* changeMediaState(client, message) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();

    const attendeeList = room.getAttendeeList();
    attendeeList.changeMediaStateForMember(message.attendeeId, message.mediaState);
}

function* changeCapabilities(client, message) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();

    if (user.isTeacher) {
        const attendeeList = room.getAttendeeList();
        attendeeList.changeCapabilitiesForMember(message.attendeeId, message.capabilities);
    }
}

function* kickAttendee(client, message) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();

    if (userHelper.getUser().isTeacher) {
        const attendeeList = room.getAttendeeList();
        attendeeList.addKickedUser(message.attendeeId);
        client.clientTable.findFirstChannelForUserId(message.attendeeId).sendSimpleMessage('attendeeList:kicked');
    }
}

function* raiseHand(client, message) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();

    const attendeeList = room.getAttendeeList();
    attendeeList.changeRaiseHandForMember(message.attendeeId, message.isRaiseHand);
}
