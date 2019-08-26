import React, {Component, PropTypes} from 'react';
import AbstractShape from '../AbstractShape';
import {findItemByCommandId} from 'domain/whiteboard/paperChildrenSearch';

export default class VirtualShape extends AbstractShape {
    draw() {
        this.handleShape(item => this.editShape(item));
    }

    handleShape(callback) {
        const {paper, command} = this.props;
        const content = command.body;

        const dirtyItem = findItemByCommandId(paper, content.itemCommandId);

        if (!dirtyItem)
            return;

        callback(dirtyItem);
        this.notifyItemChanges(dirtyItem);
    }

    editShape(dirtyItem) {
        throw new Error('This method should be overridden');
    }

    notifyItemChanges(dirtyItem) {
        dirtyItem.onChange && dirtyItem.onChange();
    }

    onDisappear() {
        this.handleShape(item => this.restoreShape(item));
    }

    restoreShape(dirtyItem) {
        throw new Error('This method should be overridden');
    }
}
