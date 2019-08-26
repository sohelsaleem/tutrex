const GROUND_LAYER = 'ground';

export default class ScrollComputer {

    constructor(paper) {
        this.paper = paper;
    }

    getScrollState() {
        const {horizontalScrollVisible, verticalScrollVisible} = this.getScrollVisibility();
        const {horizontalScrollOffset, verticalScrollOffset} = this.getRelativeScrollOffset();
        const {horizontalBarSize, verticalBarSize} = this.getScrollBarSize();

        const verticalMaxScrollOffset = 1 - verticalBarSize;
        const horizontalMaxScrollOffset = 1 - horizontalBarSize;

        return {
            horizontalScrollVisible, verticalScrollVisible,
            horizontalScrollOffset, verticalScrollOffset,
            horizontalMaxScrollOffset, verticalMaxScrollOffset
        };
    }

    getScrollBarSize() {
        const viewBounds = this.getViewBounds();
        const layerBounds = this.getLayerBounds();

        const horizontalBarSize = Math.min(1, viewBounds.width / layerBounds.width);
        const verticalBarSize = Math.min(1, viewBounds.height / layerBounds.height);

        return {horizontalBarSize, verticalBarSize};
    }

    getRelativeScrollOffset() {
        const {horizontalScrollVisible, verticalScrollVisible} = this.getScrollVisibility();
        const {offsetX, offsetY} = this.getAbsoluteOffset();
        const {hiddenWidth, hiddenHeight} = this.getHiddenSize();

        const horizontalScrollOffset = horizontalScrollVisible ? offsetX / hiddenWidth : 0;
        const verticalScrollOffset = verticalScrollVisible ? offsetY / hiddenHeight : 0;

        return {horizontalScrollOffset, verticalScrollOffset};
    }

    getAbsoluteOffset() {
        const viewBounds = this.getViewBounds();
        const layerBounds = this.getLayerBounds();

        const offsetX = viewBounds.x - layerBounds.x;
        const offsetY = viewBounds.y - layerBounds.y;

        return {offsetX, offsetY};
    }

    getScrollVisibility() {
        const {hiddenWidth, hiddenHeight} = this.getHiddenSize();

        const horizontalScrollVisible = hiddenWidth > 0;
        const verticalScrollVisible = hiddenHeight > 0;

        return {horizontalScrollVisible, verticalScrollVisible};
    }

    getHiddenSize() {
        const viewBounds = this.getViewBounds();
        const layerBounds = this.getLayerBounds();

        const hiddenWidth = layerBounds.width - viewBounds.width;
        const hiddenHeight = layerBounds.height - viewBounds.height;

        return {hiddenWidth, hiddenHeight};
    }

    getSpaceAroundSize() {
        const {hiddenWidth, hiddenHeight} = this.getHiddenSize();

        return {
            spaceAroundWidth: -hiddenWidth,
            spaceAroundHeight: -hiddenHeight
        };
    }

    getViewBounds() {
        return this.paper.view.bounds;
    }

    getLayerBounds() {
        const groundLayer = this.paper.project.layers.find(l => l.name === GROUND_LAYER);
        return groundLayer.bounds;
    }
}
