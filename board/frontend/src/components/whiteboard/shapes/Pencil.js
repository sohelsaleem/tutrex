import AbstractShape from './AbstractShape';
import makePaperColor from './makePaperColor';

import ScalingUtils from 'domain/whiteboard/ScalingUtils';

const SMOOTH_OPTIONS = {type: 'catmull-rom', factor: 1};

export default class Pencil extends AbstractShape {
    draw() {
        const {paper, command} = this.props;
        const content = command.body;
        const contentParts = Array.isArray(content) ? content : [content];

        this.mainItem = this.createPath(contentParts[0]);

        contentParts.forEach(contentPart => {
            contentPart.points.forEach(point => {
                const projectPoint = ScalingUtils.deserializePoint(new paper.Point(point.x, point.y));
                this.mainItem.add(projectPoint);
            });
        });

        this.mainItem.smooth(SMOOTH_OPTIONS);

        paper.view.draw();
    }

    createPath({stroke}) {
        const {paper} = this.props;

        const path = new paper.Path();
        this.saveMainItem(path);

        path.strokeColor = makePaperColor(stroke.color);
        path.strokeWidth = stroke.width;

        path.strokeCap = 'round';
        path.strokeScaling = false;

        return path;
    }
}
