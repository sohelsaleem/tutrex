import ScrollBarOrientation from './ScrollBarOrientation';
import styles from './VerticalScrollBarOrientation.scss';

export default class VerticalScrollBarOrientation extends ScrollBarOrientation {

    getStyle(scrollOffset, size) {
        return {
            top: this.getPercent(scrollOffset),
            height: this.getPercent(size)
        };
    }

    getMouseCoordinate(event) {
        return this.getMouseLocation(event).clientY;
    }

    getScrollBarSize(element) {
        return element.clientHeight;
    }

    needScrollOnWheel(event) {
        return !event.shiftKey;
    }

    wrapValueToVector(value) {
        return {y: value};
    }

    getScrollClassName() {
        return styles.scroll;
    }

    getBarClassName() {
        return styles.bar;
    }
}
