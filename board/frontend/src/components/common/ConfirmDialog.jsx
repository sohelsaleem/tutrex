import React, {Component, PropTypes} from 'react';
import Dialog from './Dialog';

import customStyle from 'components/ComponentsTheme.scss';
import styles from './ConfirmDialog.scss';

export default class ConfirmDialog extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        yesText: PropTypes.string,
        noText: PropTypes.string,
        closable: PropTypes.bool,
        onConfirm: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        enabledConfirm: PropTypes.bool
    };

    static defaultProps = {
        title: 'Confirm',
        yesText: 'Yes',
        noText: 'No',
        closable: true,
        enabledConfirm: true
    };

    render() {
        const {
            title,
            text,
            yesText,
            noText,
            closable,
            onConfirm,
            onClose,
            enabledConfirm
        } = this.props;

        return (
            <Dialog title={title}
                    closable={closable }
                    onClose={onClose}>
                <div className={styles.informationText}>{text}</div>
                <div className={styles.buttons}>
                    <button className={customStyle.buttonGrey} onClick={onClose}>{noText}</button>
                    <button className={customStyle.buttonBlue} onClick={onConfirm} disabled={!enabledConfirm}>{yesText}</button>
                </div>
            </Dialog>
        );
    }
}
