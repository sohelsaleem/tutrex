import {Component, PropTypes} from 'react';
import preparePaperItem from './preparePaperItem';

export default class AbstractShape extends Component {
    static propTypes = {
        command: PropTypes.object.isRequired,
        paper: PropTypes.object.isRequired,
        canvasWidth: PropTypes.number.isRequired,
        canvasHeight: PropTypes.number.isRequired
    };

    componentWillMount() {
        this.draw();
    }

    componentWillUpdate(nextProps) {
        if (nextProps.canvasWidth != this.props.canvasWidth || nextProps.canvasHeight != this.props.canvasHeight) {
            this.clear();
            this.draw();
        }
    }

    componentWillUnmount() {
        this.clear();
        this.onDisappear();
    }

    clear() {
        if (this.mainItem) {
            this.mainItem.remove();
            this.mainItem = null;
        }
    }

    onDisappear() {
    }

    saveMainItem(item) {
        const {command} = this.props;
        preparePaperItem(command, item);

        this.mainItem = item;
    }

    draw() {
        throw new Error('This method should be override');
    }

    render() {
        return null;
    }
}
