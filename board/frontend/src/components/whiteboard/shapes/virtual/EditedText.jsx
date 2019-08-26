import React, {Component, PropTypes} from 'react';
import VirtualShape from './VirtualShape';
import ScalingUtils from 'domain/whiteboard/ScalingUtils';

export default class EditedText extends VirtualShape {
    editShape(dirtyItem) {
        const {command: {body}} = this.props;
        this.saveItem(dirtyItem);
        this.updateItem(dirtyItem, body);
    }

    saveItem(dirtyItem) {
        this.originalItem = dirtyItem.clone({insert: false});
    }

    updateItem(item, body) {
        const {paper} = this.props;

        const point = ScalingUtils.deserializePoint(new paper.Point(body.point.x, body.point.y));
        const fontSize = ScalingUtils.deserializeCoordinateY(body.fontSize);
        const content = body.text;

        item.set({
            point,
            fontSize,
            content
        });
    }

    restoreShape(dirtyItem) {
        dirtyItem.copyContent(this.originalItem);
    }
}
