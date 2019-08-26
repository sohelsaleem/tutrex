import {connect} from 'react-redux';

import {getWhiteboardHistory, changeBoardRenderingStatus, closeBoard, changeDocumentScroll} from 'actions/whiteboard';
import {getCurrentBoard} from 'helpers/BoardHelper';

import Board from 'components/whiteboard/Board';

const mapStateToProps = (state) => {
    const board = getCurrentBoard(state);

    return {board};
};

const mapDispatchToProps = {
    onAppear: getWhiteboardHistory,
    onRenderingChange: changeBoardRenderingStatus,
    onCloseBoard: closeBoard,
    onScrollDocument: changeDocumentScroll
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);
