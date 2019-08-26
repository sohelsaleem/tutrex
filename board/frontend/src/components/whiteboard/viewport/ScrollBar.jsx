import React, {Component, PropTypes} from 'react';
import EventListener from 'react-event-listener';

import _ from 'lodash';

import * as ScrollBarOrientationFactory from './ScrollBarOrientationFactory';

export default class VerticalScrollBar extends Component {
    static propTypes = {
        value: PropTypes.number.isRequired,
        maxValue: PropTypes.number.isRequired,
        horizontal: PropTypes.bool,
        onChange: PropTypes.func.isRequired
    };

    state = {
        dragging: false,
        startDraggingValue: 0,
        startDraggingMouseCoordinate: 0
    };

    constructor(props) {
        super(props);
        this.scrollBarOrientation = props.horizontal ?
            ScrollBarOrientationFactory.horizontal() :
            ScrollBarOrientationFactory.vertical();
    }

    render() {
        const {value, maxValue} = this.props;
        const size = 1 - maxValue;
        const scrollOffset = value * maxValue;

        const scrollClassName = this.scrollBarOrientation.getScrollClassName();
        const barClassName = this.scrollBarOrientation.getBarClassName();
        const barStyle = this.scrollBarOrientation.getStyle(scrollOffset, size);

        return (
            <div ref='scrollBar'
                 className={scrollClassName}
                 onMouseDown={this.handleStartDragging}
                 onTouchStart={this.handleStartDragging}>

                <div className={barClassName}
                     style={barStyle}></div>

                <EventListener target='document'
                               onWheel={this.handleWheelScroll}
                               onMouseMove={this.handleDragging}
                               onTouchMove={this.handleDragging}
                               onMouseUp={this.handleStopDragging}
                               onTouchUp={this.handleStopDragging}/>
            </div>
        );
    }

    handleStartDragging = event => {
        const {value} = this.props;
        const mouseCoordinate = this.scrollBarOrientation.getMouseCoordinate(event);

        this.setState({
            dragging: true,
            startDraggingValue: value,
            startDraggingMouseCoordinate: mouseCoordinate
        })
    };

    handleDragging = event => {
        if (!this.state.dragging)
            return;

        event.preventDefault();

        const mouseCoordinate = this.scrollBarOrientation.getMouseCoordinate(event);
        const absoluteDelta = mouseCoordinate - this.state.startDraggingMouseCoordinate;

        const {startDraggingValue} = this.state;
        this.handleScroll(startDraggingValue, absoluteDelta);
    };

    handleScroll(startValue, absoluteDelta) {
        const {maxValue, onChange} = this.props;
        const scrollBarSize = this.scrollBarOrientation.getScrollBarSize(this.refs.scrollBar);

        const delta = absoluteDelta / (scrollBarSize * maxValue);
        const nextValue = _.clamp(startValue + delta, 0, 1);

        const scrollVector = this.scrollBarOrientation.wrapValueToVector(nextValue);
        onChange(scrollVector);
    }

    handleStopDragging = event => {
        this.setState({
            dragging: false
        });
    };

    handleWheelScroll = event => {
        if(this.isTargetNotEqualCanvas(event.target)) return;

        const {value} = this.props;
        if (this.scrollBarOrientation.needScrollOnWheel(event))
            this.handleScroll(value, event.deltaY);
    };

    isTargetNotEqualCanvas(target) {
        const canvasElement = document.getElementById('canvas');
        return target !== canvasElement;
    }
}
