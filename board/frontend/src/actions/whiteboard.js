export const SELECT_TOOL = 'whiteboard/SELECT_TOOL';
export const CHANGE_STROKE_FILL = 'whiteboard/CHANGE_STROKE_FILL';
export const ADD_DRAWING_COMMAND = 'whiteboard/ADD_DRAWING_COMMAND';

export const UNDO_BOARD_COMMAND = 'whiteboard/UNDO_BOARD_COMMAND';
export const REDO_BOARD_COMMAND = 'whiteboard/REDO_BOARD_COMMAND';
export const CLEAR_BOARD_COMMAND = 'whiteboard/CLEAR_BOARD_COMMAND';

export const PUSH_DRAW_CONTEXT_COMMAND = 'whiteboard/PUSH_DRAW_CONTEXT_COMMAND';
export const POP_DRAW_CONTEXT_COMMAND = 'whiteboard/POP_DRAW_CONTEXT_COMMAND';

export const SELECT_BOARD = 'whiteboard/SELECT_BOARD';
export const ADD_BOARD = 'whiteboard/ADD_BOARD';
export const CLOSE_BOARD = 'whiteboard/CLOSE_BOARD';
export const RENAME_BOARD = 'whiteboard/RENAME_BOARD';

export const SOCKET_WHITEBOARD_COMMAND_NEW = 'whiteboard:command:new';
export const SOCKET_WHITEBOARD_COMMAND_UNDONE = 'whiteboard:command:undone';
export const SOCKET_WHITEBOARD_COMMAND_REDONE = 'whiteboard:command:redone';
export const SOCKET_WHITEBOARD_CLEARED = 'whiteboard:board:cleared';
export const SOCKET_WHITEBOARD_NEW = 'whiteboard:board:new';
export const SOCKET_WHITEBOARD_REMOVED = 'whiteboard:board:removed';
export const SOCKET_WHITEBOARD_SELECTED = 'whiteboard:board:selected';
export const SOCKET_WHITEBOARD_RENAMED = 'whiteboard:board:renamed';

export const SELECT_DOCUMENT_PAGE = 'whiteboard/SELECT_DOCUMENT_PAGE';
export const ZOOM_DOCUMENT = 'whiteboard/ZOOM_DOCUMENT';
export const SCROLL_DOCUMENT = 'whiteboard/SCROLL_DOCUMENT';
export const FULLSCREEN_DOCUMENT = 'whiteboard/FULLSCREEN_DOCUMENT';
export const CHANGE_BOARD_RENDERING = 'whiteboard/CHANGE_BOARD_RENDERING';

export const SOCKET_DOCUMENT_PAGE_SELECTED = 'whiteboard:document:page:selected';
export const SOCKET_DOCUMENT_NEW = 'whiteboard:document:new';

export const GET_WHITEBOARD_HISTORY = 'whiteboard/GET_WHITEBOARD_HISTORY';
export const GET_WHITEBOARD_HISTORY_SUCCESS = 'whiteboard/GET_WHITEBOARD_HISTORY_SUCCESS';
export const GET_WHITEBOARD_HISTORY_FAILURE = 'whiteboard/GET_WHITEBOARD_HISTORY_FAILURE';


export function selectTool(tool) {
    return {
        type: SELECT_TOOL,
        tool: tool
    };
}

export function addDrawingCommand(command) {
    return {
        type: ADD_DRAWING_COMMAND,
        socketSend: {
            event: 'whiteboard:command:add',
            body: {
                command
            }
        },
        command
    };
}

export function getWhiteboardHistory() {
    return {
        types: [GET_WHITEBOARD_HISTORY, GET_WHITEBOARD_HISTORY_SUCCESS, GET_WHITEBOARD_HISTORY_FAILURE],
        socketRequest: {
            event: 'whiteboard:history',
            body: {}
        }
    };
}

export function undoBoardCommand(boardId, userId) {
    return {
        type: UNDO_BOARD_COMMAND,
        socketSend: {
            event: 'whiteboard:board:undo',
            body: {
                boardId
            }
        },
        boardId,
        userId
    };
}

export function redoBoardCommand(boardId, userId) {
    return {
        type: REDO_BOARD_COMMAND,
        socketSend: {
            event: 'whiteboard:board:redo',
            body: {
                boardId
            }
        },
        boardId,
        userId
    };
}

export function clearBoard(boardId) {
    return {
        type: CLEAR_BOARD_COMMAND,
        socketSend: {
            event: 'whiteboard:board:clear',
            body: {
                boardId
            }
        },
        boardId
    };
}

export function changeStrokeFill(stroke, fill) {
    return {
        type: CHANGE_STROKE_FILL,
        stroke,
        fill
    };
}

export function pushDrawContext({stroke, fill}) {
    return {
        type: PUSH_DRAW_CONTEXT_COMMAND,
        stroke,
        fill
    };
}

export function popDrawContext() {
    return {
        type: POP_DRAW_CONTEXT_COMMAND
    };
}

export function selectBoard(boardId) {
    return {
        type: SELECT_BOARD,
        socketSend: {
            event: 'whiteboard:board:select',
            body: {
                boardId
            }
        },
        boardId
    };
}

export function addBoard() {
    return {
        type: ADD_BOARD,
        socketSend: {
            event: 'whiteboard:board:add',
            body: {}
        }
    };
}

export function closeBoard(boardId) {
    return {
        type: CLOSE_BOARD,
        socketSend: {
            event: 'whiteboard:board:remove',
            body: {
                boardId
            }
        },
        boardId
    };
}

export function selectDocumentPage(boardId, pageNumber) {
    return {
        type: SELECT_DOCUMENT_PAGE,
        socketSend: {
            event: 'whiteboard:document:page:select',
            body: {
                boardId,
                pageNumber
            }
        },
        boardId,
        pageNumber
    };
}

export function changeDocumentZoom(boardId, zoomValue) {
    return {
        type: ZOOM_DOCUMENT,
        boardId,
        zoomValue
    };
}

export function changeDocumentScroll(boardId, scrollVector) {
    return {
        type: SCROLL_DOCUMENT,
        boardId,
        scrollVector
    };
}

export function changeDocumentFullScreen({toggle, nextValue}) {
    return {
        type: FULLSCREEN_DOCUMENT,
        toggle,
        nextValue
    };
}

export function changeBoardRenderingStatus(boardId, rendering) {
    return {
        type: CHANGE_BOARD_RENDERING,
        boardId,
        rendering
    };
}

export function renameBoard(boardId, boardName) {
    return {
        type: RENAME_BOARD,
        socketSend: {
            event: 'whiteboard:board:rename',
            body: {
                boardId,
                boardName
            }
        },
        boardId,
        boardName
    };
}
