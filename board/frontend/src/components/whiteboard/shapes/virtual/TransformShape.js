import React, {Component, PropTypes} from 'react';
import VirtualShape from './VirtualShape';

import RemoveCommand from './commands/RemoveCommand';
import AffineCommand from './commands/AffineCommand';
import DrawContextCommand from './commands/DrawContextCommand';

export default class TransformShape extends VirtualShape {

    constructor(props) {
        super(props);
        this.command = null;

        this.makeCommand();
    }

    makeCommand() {
        const {paper, command: {kind, body}} = this.props;

        if (kind === 'remove')
            this.command = new RemoveCommand();
        else if (kind === 'affine')
            this.command = new AffineCommand(paper, body.matrix, body.startMatrix);
        else if (kind === 'drawContext')
            this.command = new DrawContextCommand(body.stroke, body.fill)
    }

    editShape(dirtyItem) {
        this.command.execute(dirtyItem);
    }

    restoreShape(dirtyItem) {
        const {command: {transactionState}} = this.props;

        if (transactionState !== 'commit')
            return;

        this.command.undo(dirtyItem);
    }
}
