'use strict';

const Synchronizator = require('./Synchronizator');

class WhiteboardSynchronizator extends Synchronizator {
    register(room) {
        room.getWhiteboardHistory()
            .on('command:new', this.makeListener(room, this.handleNewCommand))
            .on('command:undo', this.makeListener(room, this.handleUndoCommand))
            .on('command:redo', this.makeListener(room, this.handleRedoCommand))
            .on('board:new', this.makeListener(room, this.handleNewBoard))
            .on('board:removed', this.makeListener(room, this.handleBoardRemoved))
            .on('board:selected', this.makeListener(room, this.handleBoardSelected))
            .on('board:cleared', this.makeListener(room, this.handleClear))
            .on('board:renamed', this.makeListener(room, this.handleBoardRenamed))
            .on('document:new', this.makeListener(room, this.handleNewDocumentBoard))
            .on('document:page:selected', this.makeListener(room, this.handleSelectDocumentPage));
    }

    handleNewCommand(room, command, user) {
        this.getBroadcastChannel(room, user)
            .sendToOtherMembers('whiteboard:command:new', {command});
    }

    handleUndoCommand(room, boardId, user) {
        this.getBroadcastChannel(room, user)
            .sendToOtherMembers('whiteboard:command:undone', {boardId, userId: user.id});
    }

    handleRedoCommand(room, boardId, user) {
        this.getBroadcastChannel(room, user)
            .sendToOtherMembers('whiteboard:command:redone', {boardId, userId: user.id});
    }

    handleNewBoard(room, board, user) {
        this.getBroadcastChannel(room, user)
            .sendToOtherMembers('whiteboard:board:new', {board});
    }

    handleBoardRemoved(room, boardId, user) {
        this.getBroadcastChannel(room, user)
            .sendToOtherMembers('whiteboard:board:removed', {boardId});
    }

    handleBoardSelected(room, boardId, user) {
        this.getBroadcastChannel(room, user)
            .sendToOtherMembers('whiteboard:board:selected', {boardId});
    }

    handleBoardRenamed(room, boardId, boardName, user) {
        this.getBroadcastChannel(room, user)
            .sendToOtherMembers('whiteboard:board:renamed', {boardId, boardName});
    }

    handleClear(room, boardId, user) {
        this.getBroadcastChannel(room, user)
            .sendToOtherMembers('whiteboard:board:cleared', {boardId});
    }

    handleNewDocumentBoard(room, board, user) {
        this.getBroadcastChannel(room, user)
            .sendToRoom('whiteboard:document:new', {board});
    }

    handleSelectDocumentPage(room, boardId, pageNumber, user) {
        this.getBroadcastChannel(room, user)
            .sendToOtherMembers('whiteboard:document:page:selected', {boardId, pageNumber});
    }

    unregister(room) {
        room.getWhiteboardHistory()
            .removeListener('command:new', this.popListener(room, this.handleNewCommand))
            .removeListener('command:undo', this.popListener(room, this.handleUndoCommand))
            .removeListener('command:redo', this.popListener(room, this.handleRedoCommand))
            .removeListener('board:new', this.popListener(room, this.handleNewBoard))
            .removeListener('board:removed', this.popListener(room, this.handleBoardRemoved))
            .removeListener('board:selected', this.popListener(room, this.handleBoardSelected))
            .removeListener('board:cleared', this.popListener(room, this.handleClear))
            .removeListener('document:new', this.popListener(room, this.handleNewDocumentBoard))
            .removeListener('document:page:selected', this.popListener(room, this.handleSelectDocumentPage));
    }
}

module.exports = WhiteboardSynchronizator;
