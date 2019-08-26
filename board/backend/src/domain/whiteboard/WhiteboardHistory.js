'use strict';

const _ = require('lodash');
const AsyncEventEmitter = require('../AsyncEventEmitter');
const appendBoardCommand = require('./boardCommandAppender');
const boardCommandRevert = require('./boardCommandRevert');
const undoBoardCommand = boardCommandRevert.undoBoardCommand;
const redoBoardCommand = boardCommandRevert.redoBoardCommand;

class WhiteboardHistory extends AsyncEventEmitter {
    constructor() {
        super();
        this.boards = [
            this.makeBoardWithId(1)
        ];
        this.currentBoardId = 1;
        this.nextBoardId = 2;
    }

    makeBoardWithId(id) {
        return {
            id,
            name: `Whiteboard ${id}`,
            type: 'simple',
            commands: this.makeEmptyCommands()
        };
    }

    makeEmptyCommands() {
        return {
            finished: [],
            progress: [],
            cancelled: []
        };
    }

    addBoard(author) {
        const board = this.makeBoard();
        this.boards.push(board);

        this.emit('board:new', board, author);
    }

    makeBoard() {
        const board = this.makeBoardWithId(this.nextBoardId);

        this.currentBoardId = board.id;
        this.nextBoardId++;

        return board;
    }

    removeBoard(dirtyBoardId, author) {
        this.boards = this.boards.filter(b => b.id !== dirtyBoardId);

        if (this.currentBoardId === dirtyBoardId)
            this.selectLastBoard(author);

        this.emit('board:removed', dirtyBoardId, author);
    }

    selectLastBoard(author) {
        if (this.boards.length === 0)
            return;

        const boardId = this.boards[this.boards.length - 1].id;
        this.selectBoard(boardId, author);
    }

    selectBoard(boardId, author) {
        this.currentBoardId = boardId;
        this.emit('board:selected', boardId, author);
    }

    renameBoard(boardId, boardName, author) {
        const board = this.findBoard(boardId);
        board.name = boardName;
        this.emit('board:renamed', boardId, boardName, author);
    }

    addCommand(command, author) {
        const board = this.findVirtualBoard(command.boardId);
        appendBoardCommand(board, command);

        this.emit('command:new', command, author);
    }

    findVirtualBoard(id) {
        const board = this.findBoard(id);

        if (board.type === 'document')
            return this.getOrCreateDocumentPageBoard(board);

        return board;
    }

    getOrCreateDocumentPageBoard(board) {
        if (!board.pages[board.pageNumber]) {
            board.pages[board.pageNumber] = {
                commands: this.makeEmptyCommands()
            };
        }

        return board.pages[board.pageNumber];
    }

    findBoard(id) {
        return this.boards.find(b => b.id === id);
    }

    clearBoard(boardId, author) {
        const board = this.findVirtualBoard(boardId);

        board.commands = this.makeEmptyCommands();

        this.emit('board:cleared', boardId, author);
    }

    addDocument(documentURL, author) {
        const board = this.makeDocumentBoard(documentURL);
        this.boards.push(board);

        this.emit('document:new', board, author);
    }

    makeDocumentBoard(documentURL) {
        const board = this.makeBoard();
        board.type = 'document';
        board.documentURL = documentURL;
        board.pages = {};
        board.pageNumber = 1;
        return board;
    }

    selectDocumentPage(boardId, pageNumber, author) {
        const board = this.findBoard(boardId);
        board.pageNumber = pageNumber;

        this.emit('document:page:selected', boardId, pageNumber, author);
    }

    undo(boardId, author) {
        const board = this.findVirtualBoard(boardId);
        undoBoardCommand(board, author.id);

        this.emit('command:undo', boardId, author);
    }

    redo(boardId, author) {
        const board = this.findVirtualBoard(boardId);
        redoBoardCommand(board, author.id);

        this.emit('command:redo', boardId, author);
    }

    getBoards() {
        return this.boards.slice();
    }

    getCurrentBoardId() {
        return this.currentBoardId;
    }

    getNextBoardId() {
        return this.nextBoardId;
    }
}

module.exports = WhiteboardHistory;
