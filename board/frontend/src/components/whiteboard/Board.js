import React, {Component, PropTypes} from 'react';
import GroundLayer from './layer/GroundLayer';
import ShapeLayer from './layer/ShapeLayer';
import Viewport from './viewport/Viewport';

export default class Board extends Component {
    static propTypes = {
        paper: PropTypes.object.isRequired,
        board: PropTypes.object.isRequired,
        canvasWidth: PropTypes.number.isRequired,
        canvasHeight: PropTypes.number.isRequired,
        onAppear: PropTypes.func.isRequired,
        onRenderingChange: PropTypes.func.isRequired,
        onScrollDocument: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.onAppear();
    }

    render() {
        const {board, ...restProps} = this.props;

        const layerProps = {
            ...board,
            ...restProps
        };

        return (
            <div key={board.id}>
                <GroundLayer {...layerProps}/>
                <ShapeLayer {...layerProps}/>
                <Viewport {...layerProps}/>
            </div>
        );
    }
}
