import {Component, PropTypes} from 'react';

export default class AbstractLayer extends Component {
    static propTypes = {
        paper: PropTypes.object.isRequired,
        canvasWidth: PropTypes.number.isRequired,
        canvasHeight: PropTypes.number.isRequired
    };

    componentWillMount() {
        this.addLayer();
    }

    componentWillUpdate(prevProps) {
        if (prevProps.canvasWidth != this.props.canvasWidth || prevProps.canvasHeight != this.props.canvasHeight) {
            this.recreateLayer();
        }
    }

    componentWillUnmount() {
        this.removeLayer();
    }

    recreateLayer() {
        this.removeLayer();
        this.addLayer();
    }

    removeLayer() {
        this.onDispose();

        if (this.layer) {
            this.layer.remove();
            this.layer = null;
        }
    }

    onDispose() {

    }

    addLayer() {
        this.layer = new this.paper.Layer();
        this.layer.name = this.getLayerName();
        this.drawOnLayer();
    }

    getLayerName() {
        throw new Error('This method should be override');
    }

    drawOnLayer() {
        throw new Error('This method should be override');
    }

    render() {
        return null;
    }

    get paper() {
        return this.props.paper;
    }
}
