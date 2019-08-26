import React, {Component, PropTypes} from 'react';
import Dialog from 'components/common/Dialog';
import styles from './ConfirmDialog.scss';

export default class ErrorDialog extends Component {
    static propTypes = {
        title: PropTypes.string,
        errorMessage: PropTypes.string.isRequired,
        timeout: PropTypes.number,
        autoClose: PropTypes.bool,
        onClose: PropTypes.func.isRequired
    };

    static defaultProps = {
        title: 'Error',
        timeout: 5000
    };

    componentDidMount() {
        const {timeout, autoClose, onClose} = this.props;
        if (autoClose)
            setTimeout(onClose, timeout);
    }

    render() {
        const {errorMessage, title, onClose} = this.props;

        return (
            <Dialog title={title}
                    onClose={onClose}>
                <div className={styles.informationText}>{errorMessage}</div>
            </Dialog>
        );
    }
}
