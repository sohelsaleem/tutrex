import DrawingTool from './DrawingTool';
import makeCssColor from './makeCssColor';
import makePaperColor from 'components/whiteboard/shapes/makePaperColor';

const POINTS_PER_PART = 100;

export default class PencilTool extends DrawingTool {
    constructor(props) {
        super(props);

        this.points = [];
    }

    getToolName() {
        return 'pencil';
    }

    doFormCommandBody() {
        return {
            points: this.points.map(p => this.serializePoint(p))
        };
    }

    doOnMouseDown(point) {
        this.points = [point];
    }

    doOnMouseDrag(point) {
        if (this.isLastProgressPart()) {
            this.commandBuilder.markKeyProgress();
        }

        if (this.isNewProgressPartNeed()) {
            this.points = [this.points.pop()];
            this.commandBuilder.increasePartNumber();
        }

        this.points.push(point);
    }

    isLastProgressPart() {
        return this.points.length == POINTS_PER_PART;
    }

    isNewProgressPartNeed() {
        return this.points.length > POINTS_PER_PART;
    }

    getDrawContext(item) {
        const stroke = {
            color: makeCssColor(item.strokeColor),
            width: item.strokeWidth
        };
        const fill = null;

        return {stroke, fill};
    }

    setDrawContext(item, {stroke, fill}) {
        item.strokeColor = makePaperColor(stroke.color);
        item.strokeWidth = stroke.width;
    }
}

