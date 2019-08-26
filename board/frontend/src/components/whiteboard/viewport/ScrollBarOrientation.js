export default class ScrollBarOrientation {

    getPercent(portion) {
        return Math.round(portion * 100) + '%';
    }

    getStyle(scrollOffset, size) {
        throw new Error('his method should be overridden');
    }

    getMouseLocation(event) {
        return {
            clientX: event.clientX || event.touches[0].clientX,
            clientY: event.clientY || event.touches[0].clientY
        };
    }

    getMouseCoordinate(event) {
        throw new Error('his method should be overridden');
    }

    getScrollBarSize(element) {
        throw new Error('his method should be overridden');
    }

    needScrollOnWheel(event) {
        throw new Error('his method should be overridden');
    }

    wrapValueToVector(value) {
        throw new Error('his method should be overridden');
    }

    getScrollClassName() {
        throw new Error('his method should be overridden');
    }

    getBarClassName() {
        throw new Error('his method should be overridden');
    }
}
