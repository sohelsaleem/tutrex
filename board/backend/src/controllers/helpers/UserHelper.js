'use strict';

const userRepository = require('../../domain/repository/RepositoryRegistry').user;
const roomRepository = require('../../domain/repository/RepositoryRegistry').room;

module.exports = function (client) {
    return new UserHelper(client);
};

class UserHelper {
    constructor(client) {
        this.client = client;
    }

    getUser() {
        return userRepository.findById(this.client.getUserId());
    }

    getRoom() {
        return roomRepository.findById(this.client.getRoomId());
    }
}
