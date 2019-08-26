export function getBoardById(state, boardId) {
    return state.whiteboard.boards.find(b => b.id === boardId);
}

export function getCurrentBoard(state) {
    return getBoardById(state, state.whiteboard.currentBoardId);
}

export function getBoardCommands(board) {
    const {commands, type} = board;

    if (type === 'document')
        return getDocumentPageBoardCommands(board);

    return commands;
}

function getDocumentPageBoardCommands({pageNumber, pages}) {
    if (!pages[pageNumber]) {
        return {
            finished: [],
            progress: [],
            cancelled: []
        };
    }

    return pages[pageNumber].commands;
}

export function canUndo(state) {
    const {user} = state.room.authInfo;
    const board = getCurrentBoard(state);
    const commands = getBoardCommands(board);

    const finishedByUser = getUserCommandsListFromArray(commands.finished, user.id);

    return finishedByUser.length > 0;
}

export function canRedo(state) {
    const {user} = state.room.authInfo;
    const board = getCurrentBoard(state);
    const commands = getBoardCommands(board);

    const cancelledByUser = getUserCommandsListFromArray(commands.cancelled, user.id);

    return cancelledByUser.length > 0;
}

function getUserCommandsListFromArray(array, userId) {
    const userCommandsList = array.filter(command => {
        return command.userId === userId;
    });
    return userCommandsList;
}
