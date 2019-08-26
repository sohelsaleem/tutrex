import React, {Component, PropTypes} from 'react';
import styles from './ControlToolsPanel.scss';

import ToolButton from './ToolButton';
import ConfirmDialog from 'components/common/ConfirmDialog';

import undoIcon from './svgTools/UndoTool';
import redoIcon from './svgTools/RedoTool';
import clearBoardIcon from './svgTools/ClearBoardTool';

export default class ControlToolsPanel extends Component {
    static propTypes = {
        canUndo: PropTypes.bool.isRequired,
        canRedo: PropTypes.bool.isRequired,
        currentBoardId: PropTypes.number.isRequired,
        onUndo: PropTypes.func.isRequired,
        onRedo: PropTypes.func.isRequired,
        onClearBoard: PropTypes.func.isRequired
    };

    state = {
        displayConfirmClearDialog: false
    };

    render() {
        const {canUndo, canRedo} = this.props;
        const {displayConfirmClearDialog} = this.state;

        return (
            <div className={styles.panel}>
                <ToolButton title='Undo'
                            icon={undoIcon}
                            selected={false}
                            disabled={!canUndo}
                            onSelect={this.handleUndo}/>
                <ToolButton title='Redo'
                            icon={redoIcon}
                            selected={false}
                            disabled={!canRedo}
                            onSelect={this.handleRedo}/>

                <ToolButton title='Clear board'
                            icon={clearBoardIcon}
                            selected={false}
                            onSelect={this.handleClearBoard}/>

                {displayConfirmClearDialog && <ConfirmDialog title='Clear board'
                                                             text='Are you sure you want to clear Whiteboard? This action cannot be undone.'
                                                             yesText='Clear'
                                                             noText='Cancel'
                                                             onConfirm={this.handleConfirmClearBoard}
                                                             onClose={this.closeConfirmClearDialog}/>}
            </div>
        );
    }

    handleUndo = () => {
        const {currentBoardId, onUndo, user} = this.props;
        onUndo(currentBoardId, user.id);
    };

    handleRedo = () => {
        const {currentBoardId, onRedo, user} = this.props;
        onRedo(currentBoardId, user.id);
    };

    handleClearBoard = () => {
        this.setState({
            displayConfirmClearDialog: true
        });
    };

    handleConfirmClearBoard = () => {
        const {currentBoardId, onClearBoard} = this.props;
        onClearBoard(currentBoardId);

        this.setState({
            displayConfirmClearDialog: false
        });
    };

    closeConfirmClearDialog = () => {
        this.setState({
            displayConfirmClearDialog: false
        });
    };
}
