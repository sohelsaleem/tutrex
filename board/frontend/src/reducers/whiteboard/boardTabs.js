import {makeBoard, doAddBoard} from './boardFactory';

export function selectBoard(state, action) {
    if (state.currentBoardId === action.boardId)
        return {...state};

    return {
        ...state,
        currentBoardId: action.boardId,
        activeToolVersion: state.activeToolVersion + 1
    };
}

export function addBoard(state) {
    const newBoard = makeBoard(state);
    return doAddBoard(state, newBoard);
}

export function closeBoard(state, action) {
    const {boards, currentBoardId} = state;
    const dirtyBoardId = action.boardId;

    const nextBoards = boards.filter(b => b.id !== dirtyBoardId);
    const nextCurrentBoardId = currentBoardId !== dirtyBoardId ?
        currentBoardId :
        nextBoards[nextBoards.length - 1].id;

    return {
        ...state,
        boards: nextBoards,
        currentBoardId: nextCurrentBoardId
    };
}

export function renameBoard(state, action) {
    const {boards} = state;
    const {boardId, boardName} = action;

    const nextBoards = boards.map(b => {
        if (b.id !== boardId)
            return b;
        b.name = boardName;
        return b;
    });
    return {
        ...state,
        boards: nextBoards
    };
}
