import {connect} from 'react-redux';

import {selectTool, clearBoard, undoBoardCommand, redoBoardCommand} from 'actions/whiteboard';

import ToolsComponent from 'components/whiteboard/toolPanel/ToolsComponent';

import {checkAccessCurrentUser} from 'domain/Capabilities';
import {canUndo, canRedo} from 'helpers/BoardHelper';

const mapStateToProps = (state) => state => {
    const canDraw = checkAccessCurrentUser(state).canUseWhiteboard();
    const {user} = state.room.authInfo;
    return {
        canDraw: canDraw,
        activeTool: state.whiteboard.activeTool,
        currentBoardId: state.whiteboard.currentBoardId,
        canUndo: canUndo(state),
        canRedo: canRedo(state),
        user
    }
};

const mapDispatchToProps = {
    handleSelectTool: selectTool,
    onUndo: undoBoardCommand,
    onRedo: redoBoardCommand,
    onClearBoard: clearBoard
};

export default connect(mapStateToProps, mapDispatchToProps)(ToolsComponent);
