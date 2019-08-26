import React, {Component, PropTypes} from 'react';
import BoardScrollBars from './BoardScrollBars';

import _ from 'lodash';

import ScrollComputer from 'domain/whiteboard/viewport/ScrollComputer';

export default class Viewport extends Component {
    static propTypes = {
        paper: PropTypes.object.isRequired,
        zoomValue: PropTypes.number,
        onScrollDocument: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.scrollComputer = new ScrollComputer(props.paper);
    }

    componentWillMount() {
        this.updateViewMatrix(this.props);
    }

    updateViewMatrix(props) {
        const zoomValue = _.get(props, 'zoomValue', 1);
        const verticalScrollOffset = _.get(props, 'verticalScrollOffset', 0);
        const horizontalScrollOffset = _.get(props, 'horizontalScrollOffset', 0.5);

        const {view} = this.paper;
        view.matrix = new this.paper.Matrix();
        view.scale(zoomValue);
        view.center = [0, 0];
        view.onChange && view.onChange();

        const {horizontalScrollVisible, verticalScrollVisible} = this.scrollComputer.getScrollVisibility();

        const verticalCentralScrollOffset = verticalScrollVisible ? verticalScrollOffset - 0.5 : 0;
        const horizontalCentralScrollOffset = horizontalScrollVisible ? horizontalScrollOffset - 0.5 : 0;

        const {hiddenWidth, hiddenHeight} = this.scrollComputer.getHiddenSize();

        view.translate([
            -horizontalCentralScrollOffset * hiddenWidth,
            -verticalCentralScrollOffset * hiddenHeight
        ]);
    }

    componentWillUpdate(nextProps) {
        this.updateViewMatrix(nextProps);
    }

    render() {
        return <BoardScrollBars {...this.props} onScrollTo={this.handleScrollTo}/>;
    }

    handleScrollTo = (scrollVector) => {
        const {id: boardId, onScrollDocument} = this.props;
        onScrollDocument(boardId, scrollVector);
    };

    get paper() {
        return this.props.paper;
    }
}
