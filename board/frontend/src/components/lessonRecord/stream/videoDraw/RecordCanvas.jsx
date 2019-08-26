import React, {Component, PropTypes} from 'react';
import * as workerTimers from 'worker-timers';

import drawWebinarToCanvas from './drawWebinarToCanvas';

import styles from '../../hiddenMarkup.scss';

import {CANVAS_HEIGHT, CANVAS_WIDTH} from './Geometry';

export default class RecordCanvas extends Component {
    static propTypes = {
        webinarMode: PropTypes.string.isRequired,
        sources: PropTypes.object.isRequired,
        fps: PropTypes.number,
        onTrack: PropTypes.func.isRequired
    };

    static defaultProps = {
        fps: 25
    };

    timer = null;

    componentDidMount() {
        const {fps, onTrack} = this.props;

        this.startDrawingWebinar();

        const stream = this.refs.canvas.captureStream(fps);
        const videoTrack = stream.getVideoTracks()[0];
        onTrack(videoTrack);
    }

    startDrawingWebinar() {
        this.enabled = true;
        this.updateCanvasConstantly();
    }

    updateCanvasConstantly = () => {
        if (!this.enabled)
            return;

        const {webinarMode, sources} = this.props;

        drawWebinarToCanvas(this.refs.canvas, webinarMode, sources);

        if (this.timer)
            workerTimers.clearTimeout(this.timer);
        this.timer = workerTimers.setTimeout(this.updateCanvasConstantly, 1000 / this.props.fps);
    };

    componentWillUnmount() {
        this.stopDrawingWebinar();
    }

    stopDrawingWebinar() {
        this.enabled = false;
    }

    render() {
        return <canvas ref='canvas'
                       className={styles.hiddenMarkup}
                       width={CANVAS_WIDTH}
                       height={CANVAS_HEIGHT}/>;
    }
}
