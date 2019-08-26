import {makeDocumentBoard, doAddBoard, makeNewCommands} from './boardFactory';
import {closeBoard} from './boardTabs';

export function addDocumentBoard(state, action) {
    const newBoard = makeDocumentBoard(state, action);
    return doAddBoard(state, newBoard);
}

export function selectDocumentPage(state, action) {
    const {boardId, pageNumber} = action;

    const nextState = updateBoard(state, boardId, {
        pageNumber
    });

    return {
        ...nextState,
        activeToolVersion: state.activeToolVersion + 1
    };
}

function updateBoard(state, boardId, changes) {
    const newBoards = [...state.boards];
    const boardIndex = newBoards.findIndex(b => b.id === boardId);

    newBoards[boardIndex] = {
        ...newBoards[boardIndex],
        ...changes
    };

    return {
        ...state,
        boards: newBoards
    };
}

export function zoomDocument(state, action) {
    const {boardId, zoomValue} = action;

    return updateBoard(state, boardId, {
        zoomValue
    });
}

export function scrollDocument(state, action) {
    const {boardId, scrollVector} = action;

    const changes = {};
    if (scrollVector.hasOwnProperty('x'))
        changes.horizontalScrollOffset = scrollVector.x;
    if (scrollVector.hasOwnProperty('y'))
        changes.verticalScrollOffset = scrollVector.y;

    return updateBoard(state, boardId, changes);
}

export function toggleFullScreenDocument(state, action) {
    const {toggle, nextValue} = action;

    const fullScreenEnabled = toggle ?
        !state.fullScreenEnabled :
        nextValue;

    return {
        ...state,
        fullScreenEnabled
    };
}

export function changeBoardRendering(state, action) {
    const {boardId, rendering} = action;

    return updateBoard(state, boardId, {
        rendering
    });
}

export function getOrCreateDocumentPageBoard(board) {
    if (!board.pages[board.pageNumber]) {
        board.pages[board.pageNumber] = {
            commands: makeNewCommands()
        };
    }

    return board.pages[board.pageNumber];
}
