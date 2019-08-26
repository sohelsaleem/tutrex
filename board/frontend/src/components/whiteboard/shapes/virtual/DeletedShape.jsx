import React, {Component, PropTypes} from 'react';
import VirtualShape from './VirtualShape';
import RemoveCommand from './commands/RemoveCommand';

const removeCommand = new RemoveCommand();

export default class DeletedShape extends VirtualShape {

    editShape(dirtyItem) {
        removeCommand.execute(dirtyItem);
    }


    restoreShape(dirtyItem) {
        removeCommand.undo(dirtyItem);
    }
}
