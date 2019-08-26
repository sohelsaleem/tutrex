'use strict';

const UserHelper = require('./helpers/UserHelper');

module.exports = function (listenMessage) {
    listenMessage('poll:create', createPoll);
    listenMessage('poll:get', getPoll);
    listenMessage('poll:end', endPoll);
    listenMessage('poll:vote', votePoll);
    listenMessage('poll:toggleShowResults', toggleShowResults);
};

function* createPoll(client, message, responseChannel) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();
    const poll = room.getPoll();
    poll.startPoll(message.question, message.answers, user.id);

    responseChannel.sendAnswer(poll.toDto());
}

function* getPoll(client, message, responseChannel) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const poll = room.getPoll();

    responseChannel.sendAnswer(poll.getIsActive() ? poll.toDto() : null);
}

function* endPoll(client) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const poll = room.getPoll();
    poll.endPoll();
}

function* votePoll(client, message, responseChannel) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const poll = room.getPoll();
    const user = userHelper.getUser();
    poll.votePoll(user.id, message.answerKey);

    responseChannel.sendAnswer(poll.toDto());
}

function* toggleShowResults(client) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const poll = room.getPoll();
    poll.toggleShowResults();
}

