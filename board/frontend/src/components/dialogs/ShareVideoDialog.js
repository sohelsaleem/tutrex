import React, {Component, PropTypes} from 'react';
import Dialog from '../common/Dialog';

import customStyle from 'components/ComponentsTheme.scss';
import styles from './ShareVideoDialog.scss';

import TextInput from 'components/common/textInput/TextInput';

import CommonUtils from 'helpers/CommonUtils';

export default class ShareVideoDialog extends Component {
    static propTypes = {
        shareVideo: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired
    };

    state = {
        youtubeURL: "",
        hasValidYoutubeURL: false
    };

    handleTextChange = (value) => {
        const hasValidYoutubeURL = Boolean(CommonUtils.getYoutubeIdFromLink(value));
        this.setState({
            youtubeURL: value,
            hasValidYoutubeURL
        });
    };

    handleShare = () => {
        this.props.shareVideo(this.state.youtubeURL);
        this.props.onClose();
    };

    render() {
        const {
            onClose
        } = this.props;

        const { youtubeURL, hasValidYoutubeURL } = this.state;

        return (
            <Dialog title="Share Video"
                    containerClassName={styles.container}
                    onClose={onClose}>
                <div>Enter YouTube link to share file:</div>
                <div className={styles.inputLine}>
                    <TextInput ref='textInput'
                               value={youtubeURL}
                               className={styles.inputField}
                               selectionStart={0}
                               selectionEnd={0}
                               onChange={this.handleTextChange}
                               onEnter={this.handleShare} />
                    <button disabled={!hasValidYoutubeURL}
                            className={customStyle.buttonBlue}
                            onClick={this.handleShare}>Share
                    </button>
                </div>
            </Dialog>
        );
    }
}

