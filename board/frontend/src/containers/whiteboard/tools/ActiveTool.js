import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import {getFullToolList} from 'components/whiteboard/toolPanel/ToolRegistry';

import {addDrawingCommand, pushDrawContext, popDrawContext} from 'actions/whiteboard';

import {checkAccessCurrentUser} from 'domain/Capabilities';

class ActiveTool extends Component {
    static propTypes = {
        paper: PropTypes.object,
        activeTool: PropTypes.string.isRequired,
        currentBoardId: PropTypes.number.isRequired,
        onToolCommand: PropTypes.func.isRequired,
        onPushDrawContext: PropTypes.func.isRequired,
        onPopDrawContext: PropTypes.func.isRequired
    };

    render() {
        const {activeTool} = this.props;

        const selectedTool = getFullToolList()
            .find(description => description.name === activeTool);

        if (!selectedTool)
            return null;

        return this.renderTool(selectedTool);
    }

    renderTool(description) {
        const {paper, stroke, fill, activeToolVersion, onPushDrawContext, onPopDrawContext} = this.props;
        const Tool = description.tool;

        return <Tool paper={paper}
                     onCommand={this.handleToolCommand}
                     activeToolVersion={activeToolVersion}
                     onPushDrawContext={onPushDrawContext}
                     onPopDrawContext={onPopDrawContext}
                     stroke={stroke}
                     fill={fill}/>
    }

    handleToolCommand = command => {
        const {currentBoardId, canDraw, user} = this.props;

        if (!canDraw) {
            return;
        }

        command.boardId = currentBoardId;
        command.userId = user.id;

        this.callOnToolCommand(command);
    };

    callOnToolCommand(command) {
        if (command.keyProgress)
            _.defer(this.props.onToolCommand, command);
        else
            this.callDebouncedOnToolCommand(command);
    }

    callDebouncedOnToolCommand = _.debounce(command => {
        this.props.onToolCommand(command);
    });
}

const mapStateToProps = (state) => {
    const canDraw = checkAccessCurrentUser(state).canUseWhiteboard();
    const {user} = state.room.authInfo;
    return {
        activeTool: state.whiteboard.activeTool,
        activeToolVersion: state.whiteboard.activeToolVersion,
        canDraw,
        currentBoardId: state.whiteboard.currentBoardId,
        user,
        stroke: state.whiteboard.stroke,
        fill: state.whiteboard.fill
    };
};

const mapDispatchToProps = {
    onToolCommand: addDrawingCommand,
    onPushDrawContext: pushDrawContext,
    onPopDrawContext: popDrawContext
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveTool);
