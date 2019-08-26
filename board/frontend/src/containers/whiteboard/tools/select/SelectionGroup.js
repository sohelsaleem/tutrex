import _ from 'lodash';
import {getMatrixWithoutScaling} from 'domain/whiteboard/matrixDecomposition';

const SELECTION_PADDING = 5;
const SELECTION_STROKE_WIDTH = 2;
const SELECTION_COLOR = '#9ed3ff';

const RESIZE_CIRCLE_RADIUS = 5;
const ROTATE_CIRCLE_RADIUS = 10;

export default class SelectionGroup {

    constructor(paper, selectedItem) {
        this.paper = paper;
        this.selectedItem = selectedItem;

        this.group = null;
        this.selectedBoundingRect = null;
        this.resizerCircles = null;
        this.rotateCircle = null;
    }

    draw() {
        const selectedBounds = this.formSelectedBounds();

        this.selectedBoundingRect = this.createSelectedBoundingRect(selectedBounds);
        this.resizerCircles = this.createResizerCircles(selectedBounds);
        this.rotateCircle = this.createRotateCircle(selectedBounds);

        this.group = new this.paper.Group();
        this.group.addChild(this.selectedBoundingRect);
        this.group.addChild(this.rotateCircle);
        this.resizerCircles.forEach(c => this.group.addChild(c));

        this.transformGroupWithoutScaling();
    }

    transformGroupWithoutScaling() {
        const groupMatrix = this.getItemMatrixWithoutScaling();
        this.group.matrix = groupMatrix;
    }

    getItemMatrixWithoutScaling() {
        return getMatrixWithoutScaling(this.selectedItem.matrix);
    }

    formSelectedBounds() {
        const bounds = this.getNotRotatedBounds();

        const margin = this.removeViewScaling(this.selectedItem.strokeWidth);
        bounds.left -= margin;
        bounds.right += margin;
        bounds.top -= margin;
        bounds.bottom += margin;

        return bounds;
    }

    removeViewScaling(size) {
        return size / this.paper.view.matrix.scaling.x;
    }

    getNotRotatedBounds() {
        const clonedSelectedItem = this.selectedItem.clone();

        const itemMatrix = this.getItemMatrixWithoutScaling();
        clonedSelectedItem.matrix.prepend(itemMatrix.invert());

        const padding = this.removeViewScaling(SELECTION_PADDING);
        const bounds = clonedSelectedItem.bounds.expand(padding);

        clonedSelectedItem.remove();

        return bounds;
    }

    createSelectedBoundingRect(selectedBounds) {
        const rectangle = new this.paper.Path.Rectangle(selectedBounds);
        rectangle.strokeColor = SELECTION_COLOR;
        rectangle.strokeWidth = this.removeViewScaling(SELECTION_STROKE_WIDTH);

        return rectangle;
    }

    createResizerCircles(selectedBounds) {
        return _.range(4)
            .map(index => {
                const i = Math.floor(index / 2);
                const j = index % 2;

                const x = selectedBounds.x + j * selectedBounds.width;
                const y = selectedBounds.y + i * selectedBounds.height;

                const radius = this.removeViewScaling(RESIZE_CIRCLE_RADIUS);
                const circle = new this.paper.Path.Circle(new this.paper.Point(x, y), radius);
                circle.strokeColor = 'black';
                circle.fillColor = 'white';
                return circle;
            });
    }

    createRotateCircle(selectedBounds) {
        const circleBottom = selectedBounds.topCenter;
        const circleRadius = this.removeViewScaling(ROTATE_CIRCLE_RADIUS);
        const circleCenter = circleBottom.add(new this.paper.Point(0, -2 * circleRadius));

        return new this.paper.Raster({
            source: 'src/assets/tools/tool_rotate.png',
            position: circleCenter,
            scaling: this.removeViewScaling(1)
        });
    }

    contains(point) {
        return this.group.contains(point);
    }

    getTransformationKind(point) {
        if (this.resizerCircles.some(c => c.contains(point)))
            return 'scale';

        if (this.rotateCircle.contains(point))
            return 'rotate';

        if (this.selectedBoundingRect.contains(point))
            return 'translate';

        return '';
    }

    getCursorKind(point) {
        const transformationKind = this.getTransformationKind(point);

        if (transformationKind === 'translate')
            return 'move';
        if (transformationKind === 'rotate')
            return 'pointer';
        if (transformationKind === 'scale')
            return this.getScaleCursorKind(point);

        return null;
    }

    getScaleCursorKind(point) {
        const index = this.resizerCircles.findIndex(c => c.contains(point));
        const i = Math.floor(index / 2);
        const j = index % 2;

        return i == j ? 'nwse-resize' : 'nesw-resize';
    }

    update() {
        this.remove();
        this.draw();
    }

    remove() {
        this.group.remove();
    }
}
