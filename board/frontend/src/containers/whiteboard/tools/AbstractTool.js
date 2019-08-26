import React, {Component, PropTypes} from 'react';
import makeCssColor from './makeCssColor';
import makePaperColor from 'components/whiteboard/shapes/makePaperColor';

export default class AbstractTool extends Component {
    static propTypes = {
        paper: PropTypes.object.isRequired,
        stroke: PropTypes.object.isRequired,
        fill: PropTypes.object.isRequired,
        onCommand: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.activate();
    }

    activate() {
        throw new Error('This method should be overridden');
    }

    componentWillUnmount() {
        this.deactivate();
    }

    deactivate() {
        throw new Error('This method should be overridden');
    }

    getToolName() {
        throw new Error('This method should be overridden');
    }

    render() {
        return null;
    }

    get paper() {
        return this.props.paper;
    }

    commandCallback(...args) {
        this.props.onCommand(...args)
    }

    getDrawContext(item) {
        const stroke = {
            color: makeCssColor(item.strokeColor),
            width: item.strokeWidth
        };
        const fill = {
            color: makeCssColor(item.fillColor)
        };

        return {stroke, fill};
    }

    setDrawContext(item, {stroke, fill}) {
        item.strokeColor = makePaperColor(stroke.color);
        item.strokeWidth = stroke.width;
        item.fillColor = makePaperColor(fill.color);
    }
}
