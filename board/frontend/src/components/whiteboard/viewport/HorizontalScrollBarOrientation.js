import ScrollBarOrientation from './ScrollBarOrientation';
import styles from './HorizontalScrollBarOrientation.scss';

export default class HorizontalScrollBarOrientation extends ScrollBarOrientation {

    getStyle(scrollOffset, size) {
        return {
            left: this.getPercent(scrollOffset),
            width: this.getPercent(size)
        };
    }

    getMouseCoordinate(event) {
        return this.getMouseLocation(event).clientX;
    }

    getScrollBarSize(element) {
        return element.clientWidth;
    }

    needScrollOnWheel(event) {
        return event.shiftKey;
    }

    wrapValueToVector(value) {
        return {x: value};
    }

    getScrollClassName() {
        return styles.scroll;
    }

    getBarClassName() {
        return styles.bar;
    }
}
