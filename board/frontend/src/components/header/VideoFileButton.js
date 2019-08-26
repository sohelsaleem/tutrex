import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';
import styles from './VideoFileButton.scss';

import ShareVideoDialogContainer from 'containers/dialogs/ShareVideoDialogContainer';

export default class VideoFileButton extends Component {
    state = {
        visible: false
    };

    render() {
        const {visible} = this.state;
        const {enabled} = this.props;
        const buttonClassname = classnames(styles.videoFileButton, {
            [styles.enabled]: enabled
        });

        return (
            <div className={styles.videoFileButtonContainer}>
                <div className={buttonClassname}
                     onClick={this.handleToggleDialog}/>
                {visible && <ShareVideoDialogContainer onClose={this.handleCloseDialog}/>}
            </div>
        );
    }

    handleToggleDialog = () => {
        if (this.props.enabled) {
            this.setState({
                visible: !this.state.visible
            });
        }
    };

    handleCloseDialog = () => {
        this.setState({
            visible: false
        });
    };
}

