'use strict';

const UserHelper = require('./helpers/UserHelper');

module.exports = function (listenMessage) {
    listenMessage('whiteboard:command:add', addWhiteboardCommand);
    listenMessage('whiteboard:history', getWhiteboardHistory);
    listenMessage('whiteboard:board:clear', clearWhiteboardHistory);
    listenMessage('whiteboard:board:add', addWhiteboard);
    listenMessage('whiteboard:board:remove', removeWhiteboard);
    listenMessage('whiteboard:board:select', selectWhiteboard);
    listenMessage('whiteboard:document:page:select', selectDocumentPage);
    listenMessage('whiteboard:board:undo', undoWhiteboardCommand);
    listenMessage('whiteboard:board:redo', redoWhiteboardCommand);
    listenMessage('whiteboard:board:rename', renameWhiteboard);
};

function* addWhiteboardCommand(client, message) {
    const command = message.command;

    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();

    const whiteboardHistory = room.getWhiteboardHistory();
    whiteboardHistory.addCommand(command, user);
}

function* getWhiteboardHistory(client, message, responseChannel) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();

    const whiteboardHistory = room.getWhiteboardHistory();
    const boards = whiteboardHistory.getBoards();
    const currentBoardId = whiteboardHistory.getCurrentBoardId();
    const nextBoardId = whiteboardHistory.getNextBoardId();

    responseChannel.sendAnswer({
        currentBoardId,
        nextBoardId,
        boards
    });
}

function* clearWhiteboardHistory(client, message) {
    const boardId = message.boardId;

    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();

    const whiteboardHistory = room.getWhiteboardHistory();
    whiteboardHistory.clearBoard(boardId, user);
}

function* addWhiteboard(client, message) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();

    const whiteboardHistory = room.getWhiteboardHistory();
    whiteboardHistory.addBoard(user);
}

function* removeWhiteboard(client, message) {
    const boardId = message.boardId;

    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();

    const whiteboardHistory = room.getWhiteboardHistory();
    whiteboardHistory.removeBoard(boardId, user);
}

function* selectWhiteboard(client, message) {
    const boardId = message.boardId;

    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();

    const whiteboardHistory = room.getWhiteboardHistory();
    whiteboardHistory.selectBoard(boardId, user);
}

function* renameWhiteboard(client, message) {
    const boardId = message.boardId;
    const boardName = message.boardName;

    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();

    const whiteboardHistory = room.getWhiteboardHistory();
    whiteboardHistory.renameBoard(boardId, boardName, user);
}

function* selectDocumentPage(client, message) {
    const boardId = message.boardId;
    const pageNumber = message.pageNumber;

    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();

    const whiteboardHistory = room.getWhiteboardHistory();
    whiteboardHistory.selectDocumentPage(boardId, pageNumber, user);
}

function* undoWhiteboardCommand(client, message) {
    const boardId = message.boardId;
    
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();

    const whiteboardHistory = room.getWhiteboardHistory();
    whiteboardHistory.undo(boardId, user);
}

function* redoWhiteboardCommand(client, message) {
    const boardId = message.boardId;

    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();

    const whiteboardHistory = room.getWhiteboardHistory();
    whiteboardHistory.redo(boardId, user);
}