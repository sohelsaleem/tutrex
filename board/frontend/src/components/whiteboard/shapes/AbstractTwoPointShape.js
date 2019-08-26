import AbstractShape from './AbstractShape';
import makePaperColor from './makePaperColor';

import ScalingUtils from 'domain/whiteboard/ScalingUtils';

const SMOOTH_OPTIONS = {type: 'catmull-rom', factor: 0.2};

export default class AbstractTwoPointShape extends AbstractShape {
    draw() {
        const {paper, command} = this.props;
        const content = command.body;

        const from = ScalingUtils.deserializePoint(new paper.Point(content.startPoint.x, content.startPoint.y));
        const to = ScalingUtils.deserializePoint(new paper.Point(content.point.x, content.point.y));

        this.createPath(from, to, content);
    }

    createPath(from, to, {stroke, fill}) {
        const path = this.createShape(from, to);
        this.saveMainItem(path);

        path.strokeColor = makePaperColor(stroke.color);
        path.strokeWidth = stroke.width;
        path.strokeScaling = false;

        path.fillColor = makePaperColor(fill.color);
    }

    createShape() {
        throw new Error('Abstract method in class:' + this.constructor.name);
    }
}

