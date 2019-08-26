import React, {Component, PropTypes} from 'react';
import ScrollBar from './ScrollBar';

import ScrollComputer from 'domain/whiteboard/viewport/ScrollComputer';

export default class ScrollBars extends Component {
    static propTypes = {
        paper: PropTypes.object.isRequired,
        onScrollTo: PropTypes.func.isRequired
    };

    state = {
        verticalScrollVisible: true,
        verticalScrollOffset: 0,
        verticalMaxScrollOffset: 1,

        horizontalScrollVisible: true,
        horizontalScrollOffset: 0,
        horizontalMaxScrollOffset: 1
    };

    constructor(props) {
        super(props);
        this.scrollComputer = new ScrollComputer(props.paper);
    }

    componentDidMount() {
        this.updateScrollBars();
    }

    componentWillReceiveProps(nextProps) {
        this.updateScrollBars();
    }

    updateScrollBars() {
        const {
            verticalScrollVisible,
            verticalScrollOffset,
            verticalMaxScrollOffset,

            horizontalScrollVisible,
            horizontalScrollOffset,
            horizontalMaxScrollOffset
        } = this.scrollComputer.getScrollState();

        this.setState({
            verticalScrollVisible,
            verticalScrollOffset,
            verticalMaxScrollOffset,

            horizontalScrollVisible,
            horizontalScrollOffset,
            horizontalMaxScrollOffset
        })
    }

    render() {
        const {
            verticalScrollVisible,
            verticalScrollOffset,
            verticalMaxScrollOffset,

            horizontalScrollVisible,
            horizontalScrollOffset,
            horizontalMaxScrollOffset
        } = this.state;

        return (
            <div>
                {verticalScrollVisible && <ScrollBar value={verticalScrollOffset}
                                                     maxValue={verticalMaxScrollOffset}
                                                     onChange={this.handleScroll}/>}
                {horizontalScrollVisible && <ScrollBar value={horizontalScrollOffset}
                                                       maxValue={horizontalMaxScrollOffset}
                                                       horizontal
                                                       onChange={this.handleScroll}/>}
            </div>
        );
    }

    handleScroll = (scrollVector) => {
        this.props.onScrollTo(scrollVector);
        this.updateScrollBars();
    };
}
