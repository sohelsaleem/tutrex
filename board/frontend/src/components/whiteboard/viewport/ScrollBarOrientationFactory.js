import VerticalScrollBarOrientation from './VerticalScrollBarOrientation';
import HorizontalScrollBarOrientation from './HorizontalScrollBarOrientation';

export function horizontal() {
    return new HorizontalScrollBarOrientation();
}

export function vertical() {
    return new VerticalScrollBarOrientation();
}
