import AbstractShape from './AbstractShape';
import makePaperColor from './makePaperColor';

import ScalingUtils from 'domain/whiteboard/ScalingUtils';

export default class Text extends AbstractShape {
    draw() {
        const {paper, command} = this.props;
        const content = command.body;

        const from = ScalingUtils.deserializePoint(new paper.Point(content.point.x, content.point.y));
        const fontSize = ScalingUtils.deserializeCoordinateY(content.fontSize);
        const {color, text} = content;

        this.createTextItem({from, fontSize, color, text});
    }

    createTextItem({from, fontSize, color, text}) {
        const {paper} = this.props;

        const textItem = new paper.PointText(from);
        this.saveMainItem(textItem);

        textItem.content = text;
        textItem.fontSize = `${fontSize}px`;

        textItem.strokeColor = makePaperColor(color);
        textItem.strokeWidth = 0;
        textItem.fillColor = makePaperColor(color);
    }
}

