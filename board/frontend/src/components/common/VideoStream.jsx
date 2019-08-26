import React, {Component, PropTypes} from 'react';

export default class VideoStream extends Component {
    static propTypes = {
        stream: PropTypes.object.isRequired,
        muted: PropTypes.bool,
        className: PropTypes.any
    };

    componentDidMount() {
        this.updateVideo();
    }

    updateVideo() {
        const {video} = this.refs;
        video.srcObject = this.props.stream;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.stream !== this.props.stream)
            this.updateVideo();
    }

    render() {
        const {className, muted} = this.props;

        return <video ref='video'
                      className={className}
                      muted={muted}
                      autoPlay/>;
    }
}
