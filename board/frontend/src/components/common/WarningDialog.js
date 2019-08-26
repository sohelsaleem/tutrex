import React, {Component, PropTypes} from 'react';
import Dialog from './Dialog';

import styles from './ConfirmDialog.scss';

export default class WarningDialog extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        okText: PropTypes.string,
        onClose: PropTypes.func.isRequired
    };

    render() {
        const {
            title,
            text,
            okText,
            visible,
            onClose
        } = this.props;

        const okLabel = okText || 'Ok';

        return (
            <Dialog title={title}
                    onClose={onClose}>
                <div className={styles.warning}>{text}</div>
                <div className={styles.buttons}>
                    <button onClick={onClose}>{okLabel}</button>
                </div>
            </Dialog>
        );
    }
}

