import React, {Component, PropTypes} from 'react';
import Dialog from './Dialog';

import customStyle from 'components/ComponentsTheme.scss';
import styles from './ConfirmDialog.scss';

export default class InformationDialog extends Component {
    static propTypes = {
        title: PropTypes.string,
        text: PropTypes.string,
        okText: PropTypes.string,
        onClose: PropTypes.func
    };

    render() {
        const {
            title,
            text,
            okText,
            onClose
        } = this.props;

        const okLabel = okText || 'Ok';

        return (
            <Dialog title={title}
                    onClose={onClose}>
                <div className={styles.informationText}>{text}</div>
                <div className={styles.buttons}>
                    <button className={customStyle.buttonBlue} onClick={onClose}>{okLabel}</button>
                </div>
            </Dialog>
        );
    }
}
