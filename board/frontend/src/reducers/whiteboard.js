import {makeBoardWithId, makeNewCommands} from './whiteboard/boardFactory';
import {addBoard, closeBoard, selectBoard, renameBoard} from './whiteboard/boardTabs';
import {
    addDocumentBoard,
    selectDocumentPage,
    zoomDocument,
    scrollDocument,
    toggleFullScreenDocument,
    changeBoardRendering,
    getOrCreateDocumentPageBoard
} from './whiteboard/document';
import {pushDrawContext, popDrawContext} from './whiteboard/drawContext';

import RequestReducerHelper from '../helpers/RequestReducerHelper';
import {
    SELECT_TOOL,
    CHANGE_STROKE_FILL,
    ADD_DRAWING_COMMAND,
    SOCKET_WHITEBOARD_COMMAND_NEW,
    SOCKET_WHITEBOARD_COMMAND_UNDONE,
    SOCKET_WHITEBOARD_COMMAND_REDONE,

    PUSH_DRAW_CONTEXT_COMMAND,
    POP_DRAW_CONTEXT_COMMAND,

    SELECT_BOARD,
    ADD_BOARD,
    CLOSE_BOARD,
    RENAME_BOARD,
    UNDO_BOARD_COMMAND,
    REDO_BOARD_COMMAND,
    CLEAR_BOARD_COMMAND,
    SOCKET_WHITEBOARD_NEW,
    SOCKET_WHITEBOARD_REMOVED,
    SOCKET_WHITEBOARD_SELECTED,
    SOCKET_WHITEBOARD_CLEARED,
    SOCKET_WHITEBOARD_RENAMED,

    SELECT_DOCUMENT_PAGE,
    ZOOM_DOCUMENT,
    SCROLL_DOCUMENT,
    FULLSCREEN_DOCUMENT,
    CHANGE_BOARD_RENDERING,
    SOCKET_DOCUMENT_PAGE_SELECTED,
    SOCKET_DOCUMENT_NEW,

    GET_WHITEBOARD_HISTORY,
    GET_WHITEBOARD_HISTORY_SUCCESS,
    GET_WHITEBOARD_HISTORY_FAILURE
} from 'actions/whiteboard';

const initialState = {
    activeTool: 'pencil',
    activeToolVersion: 1,
    stroke: {
        color: '#0f0c12',
        width: 4
    },
    fill: {
        color: 'white'
    },
    selectToolDrawContext: {
        stroke: null,
        fill: null
    },
    boards: [
        makeBoardWithId(1)
    ],
    currentBoardId: 1,
    nextBoardId: 2
};

export default function whiteboardReducer(state = initialState, action = {}) {
    const historyRequestHelper = new RequestReducerHelper('history');

    switch (action.type) {
        case SELECT_TOOL:
            return {
                ...state,
                activeTool: action.tool
            };

        case CHANGE_STROKE_FILL:
            return {
                ...state,
                stroke: action.stroke,
                fill: action.fill
            };

        case ADD_DRAWING_COMMAND:
        case SOCKET_WHITEBOARD_COMMAND_NEW:
            return addDrawCommandToTree(state, action);

        case UNDO_BOARD_COMMAND:
        case SOCKET_WHITEBOARD_COMMAND_UNDONE:
            return undoBoardCommand(state, action);

        case REDO_BOARD_COMMAND:
        case SOCKET_WHITEBOARD_COMMAND_REDONE:
            return redoBoardCommand(state, action);

        case CLEAR_BOARD_COMMAND:
        case SOCKET_WHITEBOARD_CLEARED:
            return clearBoard(state, action);

        case PUSH_DRAW_CONTEXT_COMMAND:
            return pushDrawContext(state, action);

        case POP_DRAW_CONTEXT_COMMAND:
            return popDrawContext(state);

        case SELECT_BOARD:
        case SOCKET_WHITEBOARD_SELECTED:
            return selectBoard(state, action);

        case RENAME_BOARD:
        case SOCKET_WHITEBOARD_RENAMED:
            return renameBoard(state, action);

        case ADD_BOARD:
        case SOCKET_WHITEBOARD_NEW:
            return addBoard(state);

        case CLOSE_BOARD:
        case SOCKET_WHITEBOARD_REMOVED:
            return closeBoard(state, action);

        case SOCKET_DOCUMENT_NEW:
            return addDocumentBoard(state, action);

        case SELECT_DOCUMENT_PAGE:
        case SOCKET_DOCUMENT_PAGE_SELECTED:
            return selectDocumentPage(state, action);

        case ZOOM_DOCUMENT:
            return zoomDocument(state, action);

        case SCROLL_DOCUMENT:
            return scrollDocument(state, action);

        case FULLSCREEN_DOCUMENT:
            return toggleFullScreenDocument(state, action);

        case CHANGE_BOARD_RENDERING:
            return changeBoardRendering(state, action);

        case GET_WHITEBOARD_HISTORY:
        case GET_WHITEBOARD_HISTORY_FAILURE:
            return historyRequestHelper.getNextState(state, action);


        case GET_WHITEBOARD_HISTORY_SUCCESS:
            const {history} = historyRequestHelper.getNextState(state, action);
            const {boards, currentBoardId, nextBoardId} = history;

            return {
                ...state,
                boards,
                currentBoardId,
                nextBoardId
            };

        default:
            return state;
    }
}

function addDrawCommandToTree(state, action) {
    const {command} = action;
    const {nextState, virtualBoard} = prepareCommandUpdation(state, command.boardId);

    if (command.type === 'draw')
        addDrawCommand(virtualBoard.commands, command);

    return nextState;
}

function prepareCommandUpdation(state, boardId) {
    const newBoards = [...state.boards];
    const boardIndex = newBoards.findIndex(b => b.id === boardId);
    const nextBoard = Object.assign({}, newBoards[boardIndex]);
    newBoards[boardIndex] = nextBoard;

    const virtualBoard = getVirtualBoard(nextBoard);

    const nextState = {
        ...state,
        boards: newBoards
    };

    return {nextState, virtualBoard};
}

function getVirtualBoard(nextBoard) {
    if (nextBoard.type === 'document')
        return getOrCreateDocumentPageBoard(nextBoard);

    return nextBoard;
}

function addDrawCommand(boardCommands, command) {
    const {transactionState} = command;

    if (transactionState === 'begin') {
        beginDrawCommand(boardCommands, command);
    }
    else if (transactionState === 'progress') {
        updateProgressOfDrawCommand(boardCommands, command);
    }
    else if (transactionState === 'rollback') {
        rollbackDrawCommand(boardCommands, command);
    }
    else if (transactionState === 'commit') {
        commitDrawCommand(boardCommands, command);
    }
}

function beginDrawCommand(boardCommands, command) {
    boardCommands.progress = boardCommands.progress.filter(c => c.id !== command.id);
    boardCommands.progress.push(command);
}

function updateProgressOfDrawCommand(boardCommands, command) {
    const accumulatedCommandIndex = _.findLastIndex(boardCommands.progress, c => c.id === command.id && c.partNumber === command.partNumber);

    if (accumulatedCommandIndex >= 0)
        boardCommands.progress.splice(accumulatedCommandIndex, 1);

    boardCommands.progress.push(command);
}

function rollbackDrawCommand(boardCommands, command) {
    boardCommands.progress = boardCommands.progress.filter(c => c.id !== command.id);
    boardCommands.finished = boardCommands.finished.filter(c => c.id !== command.id);
}

function commitDrawCommand(boardCommands, command) {
    boardCommands.cancelled = boardCommands.cancelled.filter(c => c.userId !== command.userId);

    const finishedCommandParts = boardCommands.progress.filter(c => c.id === command.id && c.partNumber !== command.partNumber);
    boardCommands.progress = boardCommands.progress.filter(c => c.id !== command.id);

    const accumulatedCommand = mergeCommandParts([...finishedCommandParts, command]);
    boardCommands.finished = [...boardCommands.finished, accumulatedCommand];
}

function mergeCommandParts(parts) {
    const endCommandPart = parts[parts.length - 1];
    const accumulatedCommand = {...endCommandPart};

    if (parts.length > 1)
        accumulatedCommand.body = parts.map(c => c.body);

    return accumulatedCommand;
}

function undoBoardCommand(state, action) {
    const {boardId, userId} = action;
    const {nextState, virtualBoard} = prepareCommandUpdation(state, boardId);

    const {finished, cancelled} = virtualBoard.commands;

    const userCommand = getUserCommandsListFromArray(finished, userId).pop();
    const userCommandArray = userCommand ? [userCommand] : [];

    virtualBoard.commands.finished = finished.filter(command => command !== userCommand);
    virtualBoard.commands.cancelled = [...userCommandArray, ...cancelled];

    return nextState;
}

function redoBoardCommand(state, action) {
    const {boardId, userId} = action;
    const {nextState, virtualBoard} = prepareCommandUpdation(state, boardId);

    const {finished, cancelled} = virtualBoard.commands;

    const userCommand = getUserCommandsListFromArray(cancelled, userId).shift();
    const userCommandArray = userCommand ? [userCommand] : [];

    virtualBoard.commands.finished = [...finished, ...userCommandArray];
    virtualBoard.commands.cancelled = cancelled.filter(command => command !== userCommand);

    return nextState;
}

function getUserCommandsListFromArray(array, userId) {
    const userCommandsList = array.filter(command => {
        return command.userId === userId;
    });
    return userCommandsList;
}

function clearBoard(state, action) {
    const {boardId} = action;
    const {nextState, virtualBoard} = prepareCommandUpdation(state, boardId);

    virtualBoard.commands = makeNewCommands();

    return {
        ...nextState,
        activeToolVersion: state.activeToolVersion + 1
    };
}
