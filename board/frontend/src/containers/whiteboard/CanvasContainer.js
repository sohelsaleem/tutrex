import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import BoardsContainer from './BoardsContainer';
import ActiveTool from './tools/ActiveTool';
import {getFullToolList} from 'components/whiteboard/toolPanel/ToolRegistry';
import {selectTool} from 'actions/whiteboard';

import paper from 'paper';

const styles = require('./CanvasContainer.scss');

import ResizeDetector from 'react-resize-detector';

class CanvasContainer extends Component {
    static propTypes = {
        activeTool: PropTypes.string.isRequired,
        whiteboardAccess: PropTypes.bool.isRequired
    };

    state = {
        canvasWidth: 0,
        canvasHeight: 0,
        paperInitialized: false
    };

    componentDidMount() {
        this.setupPaper();

        //TODO remove setTimeout for first resize
        setTimeout(::this.resizeCanvas, 200);
    }

    componentWillReceiveProps(nextProps){
        if(this.isLostWhiteboardAccess(nextProps)){
            const {onSelectTool} = this.props;

            onSelectTool('pencil');
        }
    }

    isLostWhiteboardAccess(nextProps){
        return this.props.whiteboardAccess && !nextProps.whiteboardAccess
    }

    setupPaper() {
        // make default pixel ratio, it can be different on mobile
        const oldPixelRatio = window.devicePixelRatio;
        window.devicePixelRatio = 1;

        paper.setup(this.refs.canvas);
        paper.keepalive = 'true';
        paper.resize = 'true';
        paper.settings.handleSize = 8;

        paper.view.center = [0, 0];

        window.devicePixelRatio = oldPixelRatio;

        this.setState({
            paperInitialized: true
        });
    }

    resizeCanvas = () => {
        const canvas = this.refs.canvas;

        paper.view.viewSize = new paper.Size(canvas.clientWidth, canvas.clientHeight);
        paper.view.center = [0, 0];

        this.setState({
            canvasWidth: canvas.clientWidth,
            canvasHeight: canvas.clientHeight
        });
    };

    render() {
        const {canvasWidth, canvasHeight, paperInitialized} = this.state;

        const canvasStyle = {
            cursor: this.getCanvasCursor()
        };

        return (
            <div className={styles.canvasContainer}>
                <div className={styles.ratioWrapper}>
                    <div className={styles.canvasWrapper} style={canvasStyle}>
                        <canvas id="canvas"
                                ref="canvas"
                                className={styles.canvas}
                                data-paper-resize="true"
                                data-paper-keepalive="true"/>
                    </div>

                    <ActiveTool paper={paper}/>
                </div>

                {paperInitialized && <BoardsContainer paper={paper}
                                                      canvasWidth={canvasWidth}
                                                      canvasHeight={canvasHeight}/>}

                <ResizeDetector handleWidth handleHeight onResize={this.resizeCanvas} />
            </div>
        );
    }

    getCanvasCursor() {
        const {whiteboardAccess, activeTool} = this.props;

        if(!whiteboardAccess) return 'auto';

        const selectedTool = getFullToolList()
            .find(description => description.name === activeTool);

        return `url(${selectedTool.cursor}), auto`;
    }
}

const mapStateToProps = (state) => {
    const {user} = state.room.authInfo;

    return {
        activeTool: state.whiteboard.activeTool,
        whiteboardAccess: user.capabilities.whiteboardAccess
    };
};

const mapDispatchToProps = {
    onSelectTool: selectTool
};

export default connect(mapStateToProps, mapDispatchToProps)(CanvasContainer);
