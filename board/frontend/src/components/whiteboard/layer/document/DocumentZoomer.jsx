import React, {Component, PropTypes} from 'react';
import styles from './DocumentZoomer.scss';
import _ from 'lodash';

import Slider from 'components/slider/Slider';

export default class DocumentZoomer extends Component {
    static propTypes = {
        canUseWhiteboard: PropTypes.bool.isRequired,
        zoomValue: PropTypes.number,
        onZoomChange: PropTypes.func.isRequired
    };

    render() {
        const zoomValue = _.get(this.props, 'zoomValue', 1);
        const zoomPercent = Math.round(zoomValue * 100);

        return (
            <div className={styles.zoomer}>
                <Slider className={styles.zoomSlider}
                        min={0.3}
                        max={2}
                        step={0.05}
                        value={zoomValue}
                        onChange={this.handleChangeZoom}/>

                <span className={styles.zoomHint}>{zoomPercent}%</span>
            </div>
        );
    }

    handleChangeZoom = value => {
        const {id: boardId} = this.props;
        this.props.onZoomChange(boardId, value);
    };
}
