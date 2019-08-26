export function makeBoard(state) {
    return makeBoardWithId(state.nextBoardId);
}

export function makeBoardWithId(id) {
    return {
        id,
        name: `Whiteboard ${id}`,
        type: 'simple',
        commands: makeNewCommands()
    };
}

export function makeNewCommands() {
    return {
        finished: [],
        progress: [],
        cancelled: []
    };
}

export function makeDocumentBoard(state, action) {
    const newBoard = makeBoard(state);
    newBoard.type = 'document';
    newBoard.documentURL = action.board.documentURL;
    newBoard.pages = {};
    newBoard.pageNumber = 1;
    newBoard.zoomValue = 1;

    return newBoard;
}

export function doAddBoard(state, newBoard) {
    const nextBoards = [...state.boards, newBoard];

    return {
        ...state,
        boards: nextBoards,
        currentBoardId: state.nextBoardId,
        nextBoardId: state.nextBoardId + 1
    }
}
