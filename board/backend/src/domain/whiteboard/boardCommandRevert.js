module.exports = {
    undoBoardCommand,
    redoBoardCommand
};

function undoBoardCommand(board, userId) {
    const finished = board.commands.finished;
    const cancelled = board.commands.cancelled;

    const userCommand = getUserCommandsListFromArray(finished, userId).pop();
    const userCommandArray = userCommand ? [userCommand] : [];
    
    board.commands.finished = finished.filter(command => command !== userCommand);
    board.commands.cancelled = userCommandArray.concat(cancelled);
}

function redoBoardCommand(board, userId) {
    const finished = board.commands.finished;
    const cancelled = board.commands.cancelled;

    const userCommand = getUserCommandsListFromArray(cancelled, userId).shift();
    const userCommandArray = userCommand ? [userCommand] : [];
    
    board.commands.finished = finished.concat(userCommandArray);
    board.commands.cancelled = cancelled.filter(command => command !== userCommand);
}

function getUserCommandsListFromArray(array, userId) {
    const userCommandsList = array.filter(command => {
        return command.userId === userId;
    });
    return userCommandsList;
}