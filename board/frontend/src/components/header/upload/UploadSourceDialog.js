import React, {Component, PropTypes} from 'react';
import Dialog from 'components/common/Dialog';

import commonStyles from 'components/ComponentsTheme.scss';
import styles from './UploadSourceDialog.scss';

export const SOURCES = {
    STORAGE: 'storage',
    LOCAL: 'local'
};

export default class UploadSourceDialog extends Component {
    static propTypes = {
        isDisplayed: PropTypes.bool,
        onClose: PropTypes.func,
        onChoose: PropTypes.func
    };

    render() {
        const {onClose, isDisplayed} = this.props;
        return (
            <Dialog onClose={onClose} title='Choose source of a file' visible={isDisplayed} dialogClassName={styles.dialog}>
                <div className={styles.actionContainer}>
                    <button className={commonStyles.buttonBlue} onClick={this.handleChoose.bind(this, SOURCES.LOCAL)}>
                        From local computer
                    </button>
                    <button className={commonStyles.buttonBlue} onClick={this.handleChoose.bind(this, SOURCES.STORAGE)}>
                        From cloud storage
                    </button>
                </div>
            </Dialog>
        );
    }

    handleChoose(source) {
        const {onChoose} = this.props;
        onChoose(source);
    }
}
