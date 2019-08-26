import React, {Component, PropTypes} from 'react';
import Dialog from './Dialog';
import CircularSmallOneColorProgress from 'components/common/progress/CircularSmallOneColorProgress';

import styles from './BlockInterfaceInformationDialog.scss';

export default class BlockInterfaceInformationDialog extends Component {
    static propTypes = {
        text: PropTypes.string
    };

    render() {
        const {
            text
        } = this.props;

        return (
            <Dialog closable={false}>
                <div className={styles.informationTextWithoutTitle}>{text}</div>
                <div className={styles.circularContainer}>
                    <CircularSmallOneColorProgress />
                </div>
            </Dialog>
        );
    }
}
