const CANVAS_QUALITY = 540;
export const CANVAS_WIDTH = 16 * CANVAS_QUALITY / 9 | 0;
export const CANVAS_HEIGHT = CANVAS_QUALITY;

const WINDOW_LEFT = 0;
const WINDOW_TOP = 0;
const WINDOW_RIGHT = 1;
const WINDOW_BOTTOM = 1;
const BOARD_WIDTH = 0.7;
const BOARD_RIGHT = WINDOW_LEFT + BOARD_WIDTH;
const RIGHT_PANEL_LEFT = BOARD_RIGHT;
const VIDEOS_HEIGHT = 0.3;
const VIDEOS_BOTTOM = WINDOW_TOP + VIDEOS_HEIGHT;
const TEXT_CHAT_TOP = VIDEOS_BOTTOM;

export function boardBounds() {
    return rectangle(WINDOW_LEFT, WINDOW_TOP, BOARD_RIGHT, WINDOW_BOTTOM);
}

function rectangle(x1, y1, x2, y2) {
    return {
        x: x1 * CANVAS_WIDTH,
        y: y1 * CANVAS_HEIGHT,
        width: (x2 - x1) * CANVAS_WIDTH,
        height: (y2 - y1) * CANVAS_HEIGHT
    };
}

export function videosBounds() {
    return rectangle(RIGHT_PANEL_LEFT, WINDOW_TOP, WINDOW_RIGHT, VIDEOS_BOTTOM);
}

export function textChatBounds() {
    return rectangle(RIGHT_PANEL_LEFT, TEXT_CHAT_TOP, WINDOW_RIGHT, WINDOW_BOTTOM);
}

export function windowBounds() {
    return rectangle(WINDOW_LEFT, WINDOW_TOP, WINDOW_RIGHT, WINDOW_BOTTOM);
}
