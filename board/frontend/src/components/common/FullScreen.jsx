import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import screenfull from 'screenfull';
import screenFullEventEmitter from 'helpers/screenFullEventEmitter';

export default class FullScreen extends Component {
    static propTypes = {
        fullScreenEnabled: PropTypes.bool,
        onFullScreenChange: PropTypes.func.isRequired
    };

    componentDidMount() {
        screenFullEventEmitter.on('change', this.handleChange);
    }

    handleChange = nextFullScreenEnabled => {
        this.props.onFullScreenChange({
            nextValue: nextFullScreenEnabled
        });
    };

    componentWillUnmount() {
        screenFullEventEmitter.removeListener('change', this.handleChange);
    }

    componentDidUpdate(prevProps) {
        const fullScreenChange = this.getFullScreenChange(prevProps);

        if (fullScreenChange.up)
            return this.turnOnFullScreen();

        if (fullScreenChange.down)
            return this.turnOffFullScreen();
    }

    getFullScreenChange(prevProps) {
        const prev = prevProps.fullScreenEnabled;
        const next = this.props.fullScreenEnabled;

        return {
            up: !prev && next,
            down: prev && !next,
            same: prev === next
        };
    }

    turnOnFullScreen() {
        const container = this.props.children && ReactDOM.findDOMNode(this.refs.container);
        screenfull.request(container);
    }

    turnOffFullScreen() {
        screenfull.exit();
    }

    render() {
        const {children} = this.props;

        if (!children)
            return null;

        return React.cloneElement(children, {
            ref: 'container'
        });
    }
}
