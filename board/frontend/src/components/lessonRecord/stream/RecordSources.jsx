import React, {PureComponent, PropTypes} from 'react';
import VideoStream from '../../common/VideoStream';
import TextChatCanvas from './videoDraw/TextChatCanvas';
import styles from '../hiddenMarkup.scss';

import {StreamTypes} from '../../../helpers/videoChat/VideoChatUtils';

export default class RecordSources extends PureComponent {
    static propTypes = {
        user: PropTypes.object.isRequired,
        chatItemList: PropTypes.array,
        streams: PropTypes.array.isRequired,
        attendeeList: PropTypes.array,
        onChange: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.dispatchSources();
    }

    dispatchSources() {
        this.props.onChange(this.getSources());
    }

    getSources() {
        return {
            board: document.getElementById('canvas'),
            videos: [...this.refs.cameraVideos.children],
            audioStreams: this.findStreamsByKind('audio'),
            screenVideo: [...this.refs.screenVideo.children][0],
            textChat: this.refs.textChat.refs.canvas
        };
    }

    componentDidUpdate() {
        this.dispatchSources();
    }

    render() {
        const {user, streams, chatItemList, attendeeList} = this.props;

        const cameraStreams = this.findStreamsByKind('video');
        const screenStreams = streams.filter(s => s.streamType === StreamTypes.SCREEN);

        return (
            <div className={styles.hiddenMarkup}>
                <div ref='cameraVideos'>
                    {cameraStreams.map(this.renderVideo)}
                </div>

                <div ref='screenVideo'>
                    {screenStreams.map(this.renderVideo)}
                </div>

                <TextChatCanvas ref='textChat'
                                chatItemList={chatItemList}
                                user={user}/>

            </div>
        );
    }

    findStreamsByKind(kind) {
        const {streams, attendeeList} = this.props;

        return streams
            .filter(s => {
                const user = attendeeList.find(u => u.id == s.userId);
                return user;
            })
            .filter(s => s.streamType === StreamTypes.CAMERA);
    }

    renderVideo = ({stream}) => {
        return <VideoStream key={stream.id}
                            stream={stream}
                            muted/>;
    };
}
