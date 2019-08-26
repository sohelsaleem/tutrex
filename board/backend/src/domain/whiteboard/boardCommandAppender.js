'use strict';

const _ = require('lodash');

module.exports = function (board, command) {
    if (command.type === 'draw')
        addDrawCommand(board.commands, command);
};

function addDrawCommand(boardCommands, command) {
    const transactionState = command.transactionState;

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
    finishedCommandParts.push(command);

    boardCommands.progress = boardCommands.progress.filter(c => c.id !== command.id);

    const accumulatedCommand = mergeCommandParts(finishedCommandParts);
    boardCommands.finished = boardCommands.finished.concat(accumulatedCommand);
}

function mergeCommandParts(parts) {
    const endCommandPart = parts[parts.length - 1];
    const accumulatedCommand = Object.assign({}, endCommandPart);

    if (parts.length > 1)
        accumulatedCommand.body = parts.map(c => c.body);

    return accumulatedCommand;
}
