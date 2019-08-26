import React, {Component, PropTypes} from 'react';
import styles from './DocumentFullScreen.scss';

import DocumentControlButton from './DocumentControlButton';

export default class DocumentFullScreen extends Component {
    static propTypes = {
        onFullScreenChange: PropTypes.func.isRequired
    };

    render() {
        return (
            <div className={styles.fullScreenButtonContainer}>
                <DocumentControlButton
                    className={styles.fullScreenButton}
                    onClick={this.handleToggleFullScreen}/>
            </div>
        );
    }

    handleToggleFullScreen = () => {
        this.props.onFullScreenChange({
            toggle: true
        });
    };
}
